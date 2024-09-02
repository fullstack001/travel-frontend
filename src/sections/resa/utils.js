import 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

function formatDate(dateString) {
  const date = new Date(dateString);
  console.log(date);
  const days = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = days[date.getMonth()];
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export const formatTime = (timeString) => {
  if (!timeString) return '';

  // Split the time into components
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  // Convert to 24-hour format
  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  // Ensure double digits for hours and minutes
  hours = hours.padStart(2, '0');
  minutes = minutes.padStart(2, '0');

  return `${hours}:${minutes}`;
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const handleExportExcel = (resaData) => {
  resaData.sort((a, b) => new Date(a.service_date) - new Date(b.service_date));
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    [
      'Dossier No',
      'Service Type',
      'Ar / Dep',
      'Client Name',
      'Agency Reference no',
      'Agency',
      'From',
      'Hotel',
      'Hotel Region',
      'Service Date',
      'End of Service',
      'Adult',
      'Child',
      'Infant',
      'Flight No',
      'Flight Time',
      ' Pick-up Time',
      'Remarks',
      'Service',
      'Type of Vehicle',
      'Adult Price',
      'Child Price',
      'Total Price',
      'Currency',
      'Invoice No',
      'Status',
      'Effect_date',
    ],
    ...resaData.map((row) => [
      row.dossier_no,
      row.service_type,
      row.arb_dep,
      row.client,
      row.agency_ref_no,
      row.agency,
      row.from,
      row.hotel,
      row.htl_region,
      formatDate(row.service_date),
      formatDate(row.endofservice),
      row.adult,
      row.child,
      row.infant,
      row.flight_no,
      formatTime(row.flight_time),
      formatTime(row.pickup_time),
      row.resa_remark,
      row.service,
      row.type_vehicle,
      row.adult_price,
      row.child_price,
      row.total_price,
      row.cur,
      row.invoce_on,
      row.status,
      row.effect_date,
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Planning');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, `Maindata${Date.now()}.xlsx`);
};

export const handleExportPdf = (resaData) => {
  resaData.sort((a, b) => new Date(a.service_date) - new Date(b.service_date));
  const doc = new jsPDF({
    orientation: 'landscape', // Change orientation to landscape
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [2000, 800], // Custom width and height in points
  });
  // Define the columns
  const columns = [
    { datakey: 'dossier_no', header: 'Dossier No' },
    { datakey: 'service_type', header: 'Service Type' },
    { datakey: 'arb_dep', header: 'Ar / Dep' },
    { datakey: 'client', header: 'Client Name' },
    { datakey: 'agency_ref_no', header: 'Agency Reference no' },
    { datakey: 'agency', header: 'Agency' },
    { datakey: 'from', header: 'From' },
    { datakey: 'hotel', header: 'Hotel' },
    { datakey: 'htl_region', header: 'Hotel Region' },
    { datakey: 'service_date', header: 'Service Date' },
    { datakey: 'endofservice', header: 'End of Service' },
    { datakey: 'adult', header: 'Adult' },
    { datakey: 'child', header: 'Child' },
    { datakey: 'infant', header: 'Infant' },
    { datakey: 'flight_no', header: 'Flight No' },
    { datakey: 'flight_time', header: 'Flight Time' },
    { datakey: 'pickup_time', header: 'Pick-up Time' },
    { datakey: 'resa_remark', header: 'Remarks' },
    { datakey: 'service', header: 'Service' },
    { datakey: 'type_vehicle', header: 'Type of Vehicle' },
    { datakey: 'adult_price', header: 'Adult Price' },
    { datakey: 'child_price', header: 'Child Price' },
    { datakey: 'total_price', header: 'Total Price' },
    { datakey: 'cur', header: 'Currency' },
    { datakey: 'invoce_on', header: 'Invoice No' },
    { datakey: 'status', header: 'Status' },
    { datakey: 'effect_date', header: 'Effect_date' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    dossier_no: row.dossier_no,
    service_type: row.service_type,
    arb_dep: row.arb_dep,
    client: row.client,
    agency_ref_no: row.agency_ref_no,
    agency: row.agency,
    from: row.from,
    hotel: row.hotel,
    htl_region: row.htl_region,
    service_date: formatDate(row.service_date),
    endofservice: formatDate(row.endofservice),
    adult: row.adult,
    child: row.child,
    infant: row.infant,
    flight_no: row.flight_no,
    flight_time: formatTime(row.flight_time),
    pickup_time: formatTime(row.pickup_time),
    resa_remark: row.resa_remark,
    service: row.service,
    type_vehicle: row.type_vehicle,
    adult_price: row.adult_price,
    child_price: row.child_price,
    total_price: row.total_price,
    cur: row.cur,
    invoce_on: row.invoce_on,
    status: row.status,
    effect_date: formatDate(row.effect_date),
  }));

  // Add table to the PDF
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.datakey])),
  });

  // Save the PDF
  doc.save(`Maindata${Date.now()}.pdf`);
};
