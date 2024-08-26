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
import { deleteData, getResaData, putResaData } from 'src/lib/resa';

import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import ResaModal from '../resa-model';
// import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
// import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ResaPage() {
  const [resaData, setResaData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('_id');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  // const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    const getResa = async () => {
      const params = {
        orderKey: order,
        orderDirect: orderBy,
        page: page + 1, // Adjust page number for the backend (1-based index)
        limit: rowsPerPage,
      };
      const resa = await getResaData(params);
      if (resa.status === 500) {
        alert('Network Error');
      } else {
        setResaData(resa.data);
        setTotalItems(resa.totalItems);
      }
    };
    getResa();
  }, [page, rowsPerPage, order, orderBy]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
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

  const handleModalSave = async (formData) => {
    const params = {
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

  // const handleFilterByName = (event) => {
  //   setPage(0);
  //   setFilterName(event.target.value);
  // };

  // const dataFiltered = applyFilter({
  //   inputData: resaData,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // });

  // const notFound = !dataFiltered.length && !!filterName;

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
      setResaData(res.data);
      setTotalItems(res.totalItems);
    }
  };

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Reservation</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleNewReservation}
        >
          New Reservation
        </Button>
      </Stack>

      <Card>
        {/* <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        /> */}

        {/* <Scrollbar> */}
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
                { id: 'arb_dep', label: 'Arv / Dep' },
                { id: 'client', label: 'Client ' },
                { id: 'agency', label: 'Agency', align: 'center' },
                { id: 'from', label: 'From' },
                { id: 'hotel', label: 'Hotel' },
                { id: 'htl_region', label: 'Htl Region' },
                { id: 'service_date', label: 'Service Date' },
                { id: 'endofservice', label: 'End of Service' },
                { id: 'no_of_ngts', label: 'No of Ngts' },
                { id: 'adult', label: 'Adult' },
                { id: 'child', label: 'Child' },
                { id: 'infant', label: 'Infant' },
                { id: 'teen', label: 'Teen' },
                { id: 'free', label: 'Freae' },
                { id: 'flight_no', label: 'Flight No' },
                { id: 'flight_time', label: 'flgt Time' },
                { id: 'resa_remark', label: 'Resa_remarks' },
                { id: 'service', label: 'Service' },
                { id: 'service_detail', label: 'Service Detail' },
                { id: 'adult_price', label: 'Adult Price' },
                { id: 'child_price', label: 'Child Price' },
                { id: 'teen_price', label: 'Teen Price' },
                { id: 'total_price', label: 'Total Price' },
                { id: 'net_price', label: 'Net Price' },
                { id: 'cash_credit', label: 'Cash / Credit' },
                { id: 'cur', label: 'Cur' },
                { id: 'roe', label: 'Roe' },
                { id: 'invoce_on', label: 'Invoice No' },
                { id: 'status', label: 'Status' },
                { id: 'effect_date', label: 'Effect_date' },
                { id: 'inv_no', label: 'Inv No' },
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
                  agency={row.agency}
                  from={row.from}
                  hotel={row.hotel}
                  htl_region={row.htl_region}
                  service_date={row.service_date}
                  endofservice={row.endofservice}
                  no_of_ngts={row.no_of_ngts}
                  adult={row.adult}
                  child={row.child}
                  infant={row.infant}
                  teen={row.teen}
                  free={row.free}
                  flight_no={row.flight_no}
                  flight_time={row.flight_time}
                  resa_remark={row.resa_remark}
                  service={row.service}
                  service_detail={row.service_detail}
                  adult_price={row.adult_price}
                  child_price={row.child_price}
                  teen_price={row.teen_price}
                  total_price={row.total_price}
                  net_price={row.net_price}
                  cash_credit={row.cash_credit}
                  cur={row.cur}
                  roe={row.roe}
                  invoce_on={row.invoce_on}
                  status={row.status}
                  effect_date={row.effect_date}
                  inv_no={row.inv_no}
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
