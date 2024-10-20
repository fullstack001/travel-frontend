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
import { getVehicleData } from 'src/lib/vehicle';
import {
  deleteData,
  getResaData,
  putResaData,
  getExportResa,
  getResaDataWithDate,
} from 'src/lib/resa';

// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';

import ResaModal from '../resa-model';
// import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, handleExportPdf, handleExportExcel } from '../utils';

// ----------------------------------------------------------------------

export default function ResaPage() {
  const [resaData, setResaData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('_id');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [maxDossierNo, setMaxDossierNo] = useState('');
  const [hotel, setHotel] = useState([]);
  const [agency, setAgency] = useState([]);
  const [service, setService] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [currentEnd, setCurrentEnd] = useState(null);
  const [searchOption, setSearchOption] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    const getListData = async () => {
      try {
        setLoading(true);
        const hotelres = await getHotelData();
        const agencyRes = await getAgencyData();
        const serviceRes = await getServiceData();
        const vehicleRes = await getVehicleData();
        setHotel(hotelres.data);
        setAgency(agencyRes.data);
        setService(serviceRes.data);
        setVehicle(vehicleRes.data);
      } catch {
        alert('network Error. Refresh page');
      } finally {
        setLoading(false);
      }
    };
    getListData();
  }, []);

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
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

  const handleModalSave = async (formData) => {
    const params = {
      filterOption: searchOption,
      filterData: filterName,
      orderKey: order,
      orderDirect: orderBy,
      newData: formData,
      page: page + 1, // Adjust page number for the backend (1-based index)
      limit: rowsPerPage,
    };

    const res = await putResaData(params);
    if (res === 500) {
      alert('Network Error');
    } else {
      if (currentRow) {
        alert('A data updated successfully');
      } else {
        alert('A data added successfully');
      }
      setMaxDossierNo(res.maxDossierNo);
      setResaData(res.data);
      setTotalItems(res.totalItems);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleDelete = (data) => {
    setDeleteId(data._id);
    setConfirmOpen(true);
  };

  // Handle closing of the confirmation dialog
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  // Handle the deletion after confirmation
  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    const params = {
      filterOption: searchOption,
      filterData: filterName,
      orderKey: order,
      orderDirect: orderBy,
      id: deleteId,
      page: page + 1, // Adjust page number for the backend (1-based index)
      limit: rowsPerPage,
    };

    const res = await deleteData(params);
    if (res === 500) {
      alert('Network Error.');
    } else {
      alert('A data deleted successfully.');
      setMaxDossierNo(res.maxDossierNo);
      setResaData(res.data);
      setTotalItems(res.totalItems);
    }
  };

  const handleDailyData = async (dateStr) => {
    const date = new Date(dateStr);
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

    const newDate =
      timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : dateStr;
    console.log(newDate);

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
    const confirmGetData = async () => {
      if (!current || !currentEnd) {
        const params = {
          filterData: filterName,
          filterOption: searchOption,
          orderKey: order,
          orderDirect: orderBy,
          page: page + 1,
          limit: rowsPerPage,
        };
        const resa = await getResaData(params);
        if (resa.status === 500) {
          alert('Network Error');
        } else {
          setMaxDossierNo(resa.maxDossierNo);
          setResaData(resa.data);
          setTotalItems(resa.totalItems);
        }
      } else {
        try {
          const data = {
            start: current,
            end: currentEnd,
            filterData: filterName,
            filterOption: searchOption,
            orderKey: order,
            orderDirect: orderBy,
            page: page + 1,
            limit: rowsPerPage,
          };
          const res = await getResaDataWithDate(data);
          if (res === 500) {
            alert('Network Error');
          } else {
            setMaxDossierNo(res.maxDossierNo);
            setResaData(res.data);
            setTotalItems(res.totalItems);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          alert('An unexpected error occurred');
        }
      }
    };
    confirmGetData();
  }, [current, currentEnd, page, rowsPerPage, order, orderBy, filterName, searchOption]);

  const getExportData = async () => {
    const data = {
      start: current,
      end: currentEnd,
    };
    const res = await getExportResa(data);
    return res.data;
  };

  const handlePdf = async () => {
    const exportData = await getExportData();
    handleExportPdf(exportData);
  };

  const handleExcel = async () => {
    const exportData = await getExportData();
    handleExportExcel(exportData);
  };

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Reservation</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          onNewResa={handleNewReservation}
          loading={loading}
          onGetDate={handleDailyData}
          onGetEndDate={handleEndDailyDate}
          pdfAction={handlePdf}
          excelAction={handleExcel}
          searchOption={searchOption}
          onSearchOptionChange={handleSearchOptionChange}
        />

        <TableContainer sx={{ overflow: 'auto', height: '76vh' }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={resaData.length}
              onRequestSort={handleSort}
              headLabel={[
                { id: '' },
                { id: 'dossier_no', label: 'File No' },
                { id: 'by', label: 'By' },
                { id: 'verified', label: 'Verified' },
                { id: 'status', label: 'Status' },
                { id: 'service', label: 'Service' },
                { id: 'service_type', label: 'Service Type' },
                { id: 'agency_ref', label: 'Agency Reference' },
                { id: 'client', label: 'Client Name' },
                { id: 'agency', label: 'Agency' },
                { id: 'from', label: 'From' },
                { id: 'to', label: 'To' },
                { id: 'excursion', label: 'Excursion' },
                { id: 'service_date', label: 'Service Date' },
                { id: 'flight_no', label: 'Flight No' },
                { id: 'flight_time', label: 'Flight Time' },
                { id: 'adult', label: 'Adult' },
                { id: 'child', label: 'Child(3-11)' },
                { id: 'infant', label: 'Infant(0-2)' },
                { id: 'teen', label: 'Teen(12-18)' },
                { id: 'resa_remark', label: 'Remarks' },
                { id: 'from_region', label: 'Region From' },
                { id: 'to_region', label: 'Region To' },
                { id: 'type_vehicle', label: 'Type of Vehicle' },
                { id: 'invoce_no', label: 'Invoice No' },
                { id: 'amount', label: 'Amount' },
                { id: 'adult_price', label: 'Adult Price' },
                { id: 'child_price', label: 'Child Price' },
                { id: 'teen_price', label: 'Teen Price' },
                { id: 'total_price', label: 'Total Price' },
                { id: 'cur', label: 'Currency' },
                { id: 'last_update', label: 'Last Update' },
              ]}
            />
            <TableBody>
              {resaData.map((row) => (
                <UserTableRow
                  key={row._id}
                  id={row._id}
                  verified={row.verified}
                  dossier_no={row.dossier_no}
                  by={row.by}
                  status={row.status}
                  service={row.service}
                  service_type={row.service_type}
                  agency_ref={row.agency_ref}
                  client={row.client}
                  agency={row.agency}
                  from={row.from}
                  to={row.to}
                  excursion={row.excursion}
                  service_date={row.service_date}
                  flight_no={row.flight_no}
                  flight_time={row.flight_time}
                  adult={row.adult}
                  child={row.child}
                  infant={row.infant}
                  teen={row.teen}
                  resa_remark={row.resa_remark}
                  from_region={row.from_region}
                  to_region={row.to_region}
                  vehicle_type={row.vehicle_type}
                  invoce_no={row.invoce_no}
                  amount={row.amount}
                  adult_price={row.adult_price}
                  child_price={row.child_price}
                  teen_price={row.teen_price}
                  total_price={row.total_price}
                  cur={row.cur}
                  last_update={row.last_update}
                  deleteAction={() => handleDelete(row)}
                  editAction={() => handleEdit(row)}
                />
              ))}

              <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, totalItems)} />

              {/* {notFound && <TableNoData query={filterName} />} */}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Scrollbar> */}

        <TablePagination
          page={page}
          component="div"
          count={totalItems}
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
        maxNumber={maxDossierNo}
        hotel={hotel}
        agency={agency}
        service={service}
        vehicle={vehicle}
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
