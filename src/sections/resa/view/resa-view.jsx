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
import { deleteData, getResaData, putResaData } from 'src/lib/resa';

// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import ResaModal from '../resa-model';
// import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';

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
  const [loading, setLoading] = useState(false);

  // const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    const getResa = async () => {
      const params = {
        filterData: filterName,
        orderKey: order,
        orderDirect: orderBy,
        page: page + 1, // Adjust page number for the backend (1-based index)
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
    };
    getResa();
  }, [page, rowsPerPage, order, orderBy, filterName]);

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
                { id: 'dossier_no', label: 'Dossier No' },
                { id: 'service_type', label: 'Service Type' },
                { id: 'arb_dep', label: 'Ar / Dep' },
                { id: 'client', label: 'Client Name' },
                { id: 'agency_ref_no', label: 'Agency Reference no' },
                { id: 'agency', label: 'Agency' },
                { id: 'from', label: 'From' },
                { id: 'hotel', label: 'Hotel' },
                { id: 'htl_region', label: 'Hotel Region' },
                { id: 'service_date', label: 'Service Date' },
                { id: 'endofservice', label: 'End of Service' },
                { id: 'adult', label: 'Adult' },
                { id: 'child', label: 'Child' },
                { id: 'infant', label: 'Infant' },
                { id: 'flight_no', label: 'Flight No' },
                { id: 'flight_time', label: 'Flight Time' },
                { id: 'pickup_time', label: ' Pick-up Time' },
                { id: 'resa_remark', label: 'Remarks' },
                { id: 'service', label: 'Service' },
                { id: 'type_vehicle', label: 'Type of Vehicle' },
                { id: 'adult_price', label: 'Adult Price' },
                { id: 'child_price', label: 'Child Price' },
                { id: 'total_price', label: 'Total Price' },
                { id: 'cur', label: 'Currency' },
                { id: 'invoce_on', label: 'Invoice No' },
                { id: 'status', label: 'Status' },
                { id: 'effect_date', label: 'Effect_date' },
              ]}
            />
            <TableBody>
              {resaData.map((row) => (
                <UserTableRow
                  key={row._id}
                  id={row._id}
                  dossier_no={row.dossier_no}
                  service_type={row.service_type}
                  arb_dep={row.arb_dep}
                  client={row.client}
                  agency_ref_no={row.agency_ref_no}
                  agency={row.agency}
                  from={row.from}
                  hotel={row.hotel}
                  htl_region={row.htl_region}
                  service_date={row.service_date}
                  endofservice={row.endofservice}
                  adult={row.adult}
                  child={row.child}
                  infant={row.infant}
                  flight_no={row.flight_no}
                  flight_time={row.flight_time}
                  pickup_time={row.pickup_time}
                  resa_remark={row.resa_remark}
                  service={row.service}
                  type_vehicle={row.type_vehicle}
                  adult_price={row.adult_price}
                  child_price={row.child_price}
                  total_price={row.total_price}
                  cash_credit={row.cash_credit}
                  cur={row.cur}
                  invoce_on={row.invoce_on}
                  status={row.status}
                  effect_date={row.effect_date}
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
