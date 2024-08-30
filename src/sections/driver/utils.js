import 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  return date.toLocaleDateString('en-US', options);
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

export const handleExportPdf = (row) => {
  const doc = new jsPDF({
    orientation: 'landscape', // Change orientation to landscape
    unit: 'mm', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [210, 297], // Custom width and height in points
  });

  doc.setFontSize(12);
  doc.text('Transfer order for', 10, 20); // (text, x, y)
  doc.text(formatDate(row[0].service_date), 170, 20); // (text, x, y)
  doc.text('CLIENT NAME : ', 10, 35);
  doc.text('AGENCY:', 10, 50);
  doc.setFontSize(20);
  doc.text(row[0].order_for, 100, 20); // (text, x, y)
  doc.setFontSize(18);
  doc.text(row[0].client, 100, 35);
  doc.text(row[0].agency, 100, 50);
  // Define the columns
  const column1 = [
    { header: 'Client Name', dataKey: 'client' },
    { header: 'From', dataKey: 'from' },
    { header: 'To', dataKey: 'to' },
    { header: 'Pick Up Time', dataKey: 'pickup_time' },
    { header: 'Flight No', dataKey: 'fligth_no' },
    { header: 'Date Service', dataKey: 'service_date' },
    { header: 'Adult', dataKey: 'adult' },
    { header: 'Child', dataKey: 'child' },
    { header: 'Infant', dataKey: 'infant' },
    { header: 'Teen', dataKey: 'teen' },
    { header: 'Resa_Remarks', dataKey: 'resa_remark' },
  ];

  // Map data to rows
  const row1 = [
    {
      client: row[0].client,
      from: row[0].from,
      to: row[0].to,
      pickup_time: formatTime(row[0].pickup_time),
      flight_no: row[0].fligth_no,
      arb_dep: row[0].arb_dep,
      service_date: formatDate(row[0].service_date),
      adult: row[0].adult,
      child: row[0].child,
      infant: row[0].infant,
      teen: row[0].teen,
      resa_remark: row[0].resa_remark,
    },
  ];

  const column2 = [
    { header: 'Vehicle Category', dataKey: 'veh_cat' },
    { header: 'Veh Number', dataKey: 'veh_no' },
    { header: 'Driver Signature', dataKey: 'driver_sign' },
    { header: 'Comments', dataKey: 'comments' },
  ];

  const row2 = [
    {
      veh_cat: row[0].veh_cat,
      veh_no: row[0].veh_no,
      driver_sign: '',
      comments: row[0].comments,
    },
  ];
  // Add table to the PDF
  doc.autoTable({
    head: [column1.map((col) => col.header)],
    body: row1.map((row) => column1.map((col) => row[col.dataKey])),
    startY: 70,
    styles: {
      fontSize: 12, // Increase the font size for the first table
    },
  });

  const tableHeight = doc.previousAutoTable.finalY; // Get the height of the first table
  const spaceBetweenTables = 15; // Desired space between tables

  doc.autoTable({
    head: [column2.map((col) => col.header)],
    body: row2.map((row) => column2.map((col) => row[col.dataKey])),
    startY: tableHeight + spaceBetweenTables,
    styles: {
      fontSize: 12, // Increase the font size for the first table
    },
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(12);
  doc.text('Signature of the guest', 10, pageHeight - 50);
  doc.text('Date: ', 10, pageHeight - 35);

  // Save the PDF
  doc.save('driver_planning.pdf');
};
