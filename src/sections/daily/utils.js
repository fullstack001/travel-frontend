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
  resaData.sort((a, b) => new Date(b.service_date) - new Date(a.service_date));
  // Create a new workbook and a new worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    [
      'Client Name',
      'From',
      'To',
      'Service Type',
      'Date Service',
      'Arv / Dep',
      'Flight No',
      'Flight Time',
      'Pick up Time',
      'Agency',
      'Adult',
      'Driver',
      'Guid',
      'Remarks',
    ],
    ...resaData.map((row) => [
      row.client,
      row.from,
      row.hotel,
      row.service_type,
      formatDate(row.service_date),
      row.arb_dep,
      row.flight_no,
      row.flight_time,
      row.pickup_time,
      row.agency,
      row.adult,
      row.driver,
      row.guid,
      row.resa_remark,
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Planning');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, 'daily_planning.xlsx');
};

export const handleExportPdf = (resaData) => {
  resaData.sort((a, b) => new Date(b.service_date) - new Date(a.service_date));
  const doc = new jsPDF({
    orientation: 'landscape', // Change orientation to landscape
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [1500, 600], // Custom width and height in points
  });
  // Define the columns
  const columns = [
    { header: 'Client Name', dataKey: 'client' },
    { header: 'From', dataKey: 'from' },
    { header: 'To', dataKey: 'hotel' },
    { header: 'Service Type', dataKey: 'service_type' },
    { header: 'Date Service', dataKey: 'service_date' },
    { header: 'Arv / Dep', dataKey: 'arb_dep' },
    { header: 'Flight No', dataKey: 'flight_no' },
    { header: 'Flight Time', dataKey: 'flight_time' },
    { header: 'Pick up Time', dataKey: 'pickup_time' },
    { header: 'Agency', dataKey: 'agency' },
    { header: 'Adult', dataKey: 'adult' },
    { header: 'Driver', dataKey: 'driver' },
    { header: 'Guid', dataKey: 'guid' },
    { header: 'Remarks', dataKey: 'remarks' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    client: row.client,
    from: row.from,
    hotel: row.hotel,
    service_type: row.service_type,
    service_date: formatDate(row.service_date),
    arb_dep: row.arb_dep,
    flight_no: row.flight_no,
    flight_time: row.flight_time,
    pickup_time: row.pickup_time,
    agency: row.agency,
    adult: row.adult,
    driver: row.driver,
    guid: row.guid,
    remarks: row.resa_remark,
  }));

  // Add table to the PDF
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  });

  // Save the PDF
  doc.save('daily_planning.pdf');
};
