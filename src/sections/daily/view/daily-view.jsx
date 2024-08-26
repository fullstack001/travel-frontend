import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { users } from 'src/_mock/user';
import { getDailyData } from 'src/lib/resa';

import Scrollbar from 'src/components/scrollbar';

import ResaModal from '../resa-model';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import {
  emptyRows,
  applyFilter,
  getComparator,
  handleExportPdf,
  handleExportExcel,
} from '../utils';

// ----------------------------------------------------------------------

export default function DailyPlanningPage() {
  const [resaData, setResaData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [current, setCurrent] = useState(null);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = resaData.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: resaData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleDailyData = async (date) => {
    setCurrent(date);
    const resa = await getDailyData(date);
    console.log(resa);
    if (resa === 500) {
      alert('NetWork Error');
    } else {
      setResaData(resa);
    }
  };

  const handleNewReservation = () => {
    setCurrentRow(null); // Clear current row data
    setIsModalOpen(true); // Open modal
  };

  const handleEdit = (rowData) => {
    setCurrentRow(rowData); // Set current row data
    setIsModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = (formData) => {
    if (currentRow) {
      // Update existing reservation
      const updatedData = resaData.map((row) => (row._id === currentRow._id ? formData : row));
      setResaData(updatedData);
    } else {
      // Add new reservation
      setResaData([...resaData, { ...formData, _id: new Date().getTime() }]);
    }
  };

  const handleDelete = (data) => {
    console.log(data);
  };

  const handlePdf = () => {
    handleExportPdf(resaData);
  };

  const handleExcel = () => {
    handleExportExcel(resaData);
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Daily Planning</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onGetDate={handleDailyData}
          showButton={current}
          NewAction={handleNewReservation}
          pdfAction={handlePdf}
          excelAction={handleExcel}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto', height: '76vh' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={resaData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'client', label: 'Client Name' },
                  { id: 'from', label: 'From' },
                  { id: 'hotel', label: 'To' },
                  { id: 'service_type', label: 'Service Type' },
                  { id: 'service_date', label: 'Date Service' },
                  { id: 'arb_dep', label: 'Arv / Dep' },
                  { id: 'flight_no', label: 'Flight No' },
                  { id: 'flight_time', label: 'flgt Time' },
                  { id: 'pickup_time', label: 'Pick up Time' },
                  { id: 'no_of_ngts', label: 'Refrence No' },
                  { id: 'agency', label: 'Agency', align: 'center' },
                  { id: 'adult', label: 'Adult' },
                  { id: 'driver', label: 'Driver' },
                  { id: 'guid', label: 'Guid' },
                  { id: 'remarks', label: 'Remarks' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      id={row._id}
                      client={row.client}
                      from={row.from}
                      hotel={row.hotel}
                      service_type={row.service_type}
                      service_date={row.service_date}
                      arb_dep={row.arb_dep}
                      flight_no={row.flight_no}
                      flight_time={row.flight_time}
                      pickup_time="Pickup time"
                      no_of_ngts={row.no_of_ngts}
                      agency={row.agency}
                      adult={row.adult}
                      driver="Driver"
                      guid="Guid"
                      remarks={row.resa_remark}
                      deleteAction={() => handleDelete(row)}
                      editAction={() => handleEdit(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, resaData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={resaData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <ResaModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialData={currentRow}
      />
    </Container>
  );
}
