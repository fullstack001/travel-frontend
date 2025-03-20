import 'jspdf-autotable';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function formatDate(dateString) {
  if (!dateString) return '';

  // Convert to UTC+4 (e.g., 'Asia/Dubai' for UTC+4 timezone)
  const d = dayjs.utc(dateString).tz('Asia/Dubai');

  // Month abbreviations
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract date components correctly
  const day = d.date(); // Use `.date()` instead of `.getDate()`
  const month = months[d.month()]; // Use `.month()` instead of `.getMonth()`
  const year = d.year(); // Use `.year()` instead of `.getFullYear()`

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

function isDateInRange(serviceDateStr, startDateStr, endDateStr) {
  const serviceDate = new Date(serviceDateStr);
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const serviceDateOnly = new Date(
    serviceDate.getFullYear(),
    serviceDate.getMonth(),
    serviceDate.getDate()
  );
  const startDateOnly = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return serviceDateOnly >= startDateOnly && serviceDateOnly <= endDateOnly;
}

function getMatchingServices(services, startDateStr, endDateStr) {
  return services.filter((service) =>
    isDateInRange(service.service_date, startDateStr, endDateStr)
  );
}

export function applyFilter({
  inputData,
  comparator,
  searchOption,
  filterName,
  current,
  currentEnd,
}) {
  console.log(inputData[0]);
  console.log(current, currentEnd);
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (current && currentEnd) {
    inputData = getMatchingServices(inputData, current, currentEnd);
  }
  if (!searchOption || !filterName) return inputData;

  if (filterName) {
    inputData = inputData.filter(
      (user) => user[searchOption].toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const handleExportExcel = (resaData) => {
  resaData.sort((a, b) => new Date(a.service_date) - new Date(b.service_date));
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    [
      'File No',
      'By',
      'Verified',
      'Status',
      'Service',
      'Service Type',
      'Agence Reference',
      'Client Name',
      'Agency',
      'From',
      'To',
      'Excursion',
      'Service Date',
      'Flight No',
      'Flight Time',
      'Adult',
      'Child(3-11)',
      'Infant(0-2)',
      'Teen(12-18)',
      'Remarks',
      'Region From',
      'Region To',
      'Type of Vehicle',
      'Invoice No',
      'Amount',
      'Adult Price',
      'Child Price',
      'Teen Price',
      'Total Price',
      'Currency',
      'Last modified',
      'License',
    ],
    ...resaData.map((row) => [
      row.dossier_no,
      row.by,
      row.verified,
      row.status,
      row.service,
      row.service_type,
      row.agency_ref,
      row.client,
      row.agency,
      row.from,
      row.to,
      row.excursion,
      formatDate(row.service_date),
      row.flight_no,
      formatTime(row.flight_time),
      row.adult,
      row.child,
      row.infant,
      row.teen,
      row.resa_remark,
      row.from_region,
      row.to_region,
      row.vehicle_type,
      row.invoice_no,
      row.amount,
      row.adult_price,
      row.child_price,
      row.teen_price,
      row.total_price,
      row.currency,
      formatDate(row.last_update),
      row.license.join(', '),
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
    { datakey: 'dossier_no', header: 'File No' },
    { datakey: 'by', header: 'By' },
    { datakey: 'verified', header: 'Verified' },
    { datakey: 'status', header: 'Status' },
    { datakey: 'service', header: 'Service' },
    { datakey: 'service_type', header: 'Service Type' },
    { datakey: 'agency_ref', header: 'Agency Reference' },
    { datakey: 'client', header: 'Client Name' },
    { datakey: 'agency', header: 'Agency' },
    { datakey: 'from', header: 'From' },
    { datakey: 'to', header: 'To' },
    { datakey: 'excursion', header: 'Excursion' },
    { datakey: 'service_date', header: 'Service Date' },
    { datakey: 'flight_no', header: 'Flight No' },
    { datakey: 'flight_time', header: 'Flight Time' },
    { datakey: 'adult', header: 'Adult' },
    { datakey: 'child', header: 'Child' },
    { datakey: 'infant', header: 'Infant' },
    { datakey: 'teen', header: 'Teen' },
    { datakey: 'resa_remark', header: 'Remarks' },
    { datakey: 'from_region', header: 'Region From' },
    { datakey: 'to_region', header: 'Region To' },
    { datakey: 'vehicle_type', header: 'Type of Vehicle' },
    { datakey: 'invoice_no', header: 'Invoice No' },
    { datakey: 'amount', header: 'Amount' },
    { datakey: 'adult_price', header: 'Adult Price' },
    { datakey: 'child_price', header: 'Child Price' },
    { datakey: 'teen_price', header: 'Teen Price' },
    { datakey: 'total_price', header: 'Total Price' },
    { datakey: 'currency', header: 'Currency' },
    { datakey: 'last_update', header: 'Last Modified' },
    { datakey: 'license', header: 'License' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    dossier_no: row.dossier_no,
    by: row.by,
    verified: row.verified,
    status: row.status,
    service: row.service,
    service_type: row.service_type,
    agency_ref: row.agency_ref,
    client: row.client,
    agency: row.agency,
    from: row.from,
    to: row.to,
    excursion: row.excursion,
    service_date: formatDate(row.service_date),
    flight_no: row.flight_no,
    flight_time: formatTime(row.flight_time),
    adult: row.adult,
    child: row.child,
    infant: row.infant,
    teen: row.teen,
    resa_remark: row.resa_remark,
    from_region: row.from_region,
    to_region: row.to_region,
    vehicle_type: row.vehicle_type,
    invoice_no: row.invoice_no,
    amount: row.amount,
    adult_price: row.adult_price,
    child_price: row.child_price,
    teen_price: row.teen_price,
    total_price: row.total_price,
    currency: row.currency,
    last_update: formatDate(row.last_update),
    license: row.license.join(', '),
  }));

  // Add table to the PDF
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.datakey])),
  });

  // Save the PDF
  doc.save(`Maindata${Date.now()}.pdf`);
};
