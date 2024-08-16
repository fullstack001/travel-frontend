import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { users } from 'src/_mock/user';
import { getResaData } from 'src/lib/resa';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ResaPage() {
  const [resaData, setResaData] = useState([]);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getResa = async () => {
      const resa = await getResaData();
      console.log(resa);
      if (resa === 500) {
        alert('NetWork Error');
      } else {
        setResaData(resa);
      }
    };
    getResa();
  }, [setResaData]);

  const handleSort = (event, _id) => {
    const isAsc = orderBy === _id && order === 'asc';
    if (_id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(_id);
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

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Reservation</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Reservation
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={resaData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
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
                  { id: 'discount', label: 'Discount' },
                  { id: 'net_price', label: 'Net Price' },
                  { id: 'cash_credit', label: 'Cash / Credit' },
                  { id: 'cur', label: 'Cur' },
                  { id: 'roe', label: 'Roe' },
                  { id: 'invoce_on', label: 'Invoice No' },
                  { id: 'status', label: 'Status' },
                  { id: 'effect_date', label: 'Effect_date' },
                  { id: 'inv_no', label: 'Inv No' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
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
                      discount={row.discount}
                      net_price={row.net_price}
                      cash_credit={row.cash_credit}
                      cur={row.cur}
                      roe={row.roe}
                      invoce_on={row.invoce_on}
                      status={row.status}
                      effect_date={row.effect_date}
                      inv_no={row.inv_no}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
