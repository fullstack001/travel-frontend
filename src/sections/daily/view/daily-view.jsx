import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import DialogContentText from '@mui/material/DialogContentText';

// import { users } from 'src/_mock/user';
import { getHotelData } from 'src/lib/hotel';
import { getAgencyData } from 'src/lib/agency';
import { getServiceData } from 'src/lib/service';
import { getDailyData, putDailyData, deleteDailyData } from 'src/lib/resa';

import Scrollbar from 'src/components/scrollbar';

import DailyModal from '../daily-model';
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
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('_id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [current, setCurrent] = useState(null);
  const [currentEnd, setCurrentEnd] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [maxDossierNo, setMaxDossierNo] = useState('');
  const [hotel, setHotel] = useState([]);
  const [agency, setAgency] = useState([]);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  useEffect(() => {
    const getListData = async () => {
      try {
        setLoading(true);
        const hotelres = await getHotelData();
        const agencyRes = await getAgencyData();
        const serviceRes = await getServiceData();
        setHotel(hotelres.data);
        setAgency(agencyRes.data);
        setService(serviceRes.data);
      } catch {
        alert('network Error. Refresh page');
      } finally {
        setLoading(false);
      }
    };
    getListData();
  }, []);

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

  const handleDailyData = async (dateStr) => {
    const date = new Date(dateStr);
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

    const newDate =
      timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : dateStr;

    setCurrent(newDate);
  };

  const handleEndDailyDate = async (dateStr) => {
    const date = new Date(dateStr);
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

    const newDate =
      timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : dateStr;

    setCurrentEnd(newDate);
  };

  useEffect(() => {
    setShowButton(false);

    const confirmGetData = async () => {
      if (!current || !currentEnd) return;
      if (current > currentEnd) {
        alert('Input currece Date!');
        return;
      }

      setPage(0);

      try {
        const data = { start: current, end: currentEnd };
        const resa = await getDailyData(data);
        if (resa === 500) {
          alert('Network Error');
        } else {
          setResaData(resa.data);
          setMaxDossierNo(resa.max_num);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An unexpected error occurred');
      } finally {
        setShowButton(true);
      }
    };
    confirmGetData();
  }, [current, currentEnd]);

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

  const handleModalSave = async (formData) => {
    const params = {
      start: current,
      end: currentEnd,
      newData: formData,
    };

    const res = await putDailyData(params);
    if (res === 500) {
      alert('Network Error');
    } else {
      if (currentRow) {
        alert('A data updated successfully');
      } else {
        alert('A data added successfully');
      }
      setResaData(res.data);
      setMaxDossierNo(res.max_num);
    }
  };

  const handleDelete = (data) => {
    setDeleteId(data._id);
    setConfirmOpen(true);
  };

  // Handle the deletion after confirmation
  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    const params = {
      start: current,
      end: currentEnd,
      id: deleteId,
    };

    const res = await deleteDailyData(params);
    if (res === 500) {
      alert('Network Error.');
    } else {
      alert('A data deleted successfully.');
      setResaData(res.data);
      setMaxDossierNo(res.max_num);
    }
  };

  // Handle closing of the confirmation dialog
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
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
          filterName={filterName}
          onFilterName={handleFilterByName}
          onGetDate={handleDailyData}
          onGetEndDate={handleEndDailyDate}
          showButton={showButton}
          NewAction={handleNewReservation}
          pdfAction={handlePdf}
          excelAction={handleExcel}
          loading={loading}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto', height: '76vh' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
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
                      pickup_time={row.pickup_time}
                      agency={row.agency}
                      adult={row.adult}
                      driver={row.driver}
                      guid={row.guid}
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

      <DailyModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialData={currentRow}
        maxNumber={maxDossierNo}
        hotel={hotel}
        agency={agency}
        service={service}
      />

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
