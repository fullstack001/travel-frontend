import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  dossier_no,
  service_type,
  arb_dep,
  client,
  agency,
  from,
  hotel,
  htl_region,
  service_date,
  endofservice,
  no_of_ngts,
  adult,
  child,
  infant,
  teen,
  free,
  flight_no,
  flight_time,
  resa_remark,
  service,
  service_detail,
  adult_price,
  child_price,
  teen_price,
  total_price,
  discount,
  net_price,
  cash_credit,
  cur,
  roe,
  invoce_on,
  status,
  effect_date,
  inv_no,
  editAction,
  deleteAction,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    editAction();
    setOpen(null);
  };
  const handleDelete = () => {
    deleteAction();
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}

        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {dossier_no}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}
            <Typography variant="subtitle2" noWrap>
              {service_type}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{arb_dep}</TableCell>
        <TableCell>{client}</TableCell>
        <TableCell>{agency}</TableCell>
        <TableCell>{from}</TableCell>
        <TableCell>{hotel}</TableCell>
        <TableCell>{htl_region}</TableCell>
        <TableCell>{service_date}</TableCell>
        <TableCell>{endofservice}</TableCell>
        <TableCell>{no_of_ngts}</TableCell>
        <TableCell>{adult}</TableCell>
        <TableCell>{child}</TableCell>
        <TableCell>{infant}</TableCell>
        <TableCell>{teen}</TableCell>
        <TableCell>{free}</TableCell>
        <TableCell>{flight_no}</TableCell>
        <TableCell>{flight_time}</TableCell>
        <TableCell>{resa_remark}</TableCell>
        <TableCell>{service}</TableCell>
        <TableCell>{service_detail}</TableCell>
        <TableCell>{adult_price}</TableCell>
        <TableCell>{child_price}</TableCell>
        <TableCell>{teen_price}</TableCell>
        <TableCell>{total_price}</TableCell>
        <TableCell>{discount}</TableCell>
        <TableCell>{net_price}</TableCell>
        <TableCell>{cash_credit}</TableCell>
        <TableCell>{cur}</TableCell>
        <TableCell>{roe}</TableCell>
        <TableCell>{invoce_on}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{effect_date}</TableCell>
        <TableCell>{inv_no}</TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any,
  dossier_no: PropTypes.any,
  service_type: PropTypes.any,
  arb_dep: PropTypes.any,
  client: PropTypes.any,
  agency: PropTypes.any,
  from: PropTypes.any,
  hotel: PropTypes.any,
  htl_region: PropTypes.any,
  service_date: PropTypes.any,
  endofservice: PropTypes.any,
  no_of_ngts: PropTypes.any,
  adult: PropTypes.any,
  child: PropTypes.any,
  infant: PropTypes.any,
  teen: PropTypes.any,
  free: PropTypes.any,
  flight_no: PropTypes.any,
  flight_time: PropTypes.any,
  resa_remark: PropTypes.any,
  service: PropTypes.any,
  service_detail: PropTypes.any,
  adult_price: PropTypes.any,
  child_price: PropTypes.any,
  teen_price: PropTypes.any,
  total_price: PropTypes.any,
  discount: PropTypes.any,
  net_price: PropTypes.any,
  cash_credit: PropTypes.any,
  cur: PropTypes.any,
  roe: PropTypes.any,
  invoce_on: PropTypes.any,
  status: PropTypes.any,
  effect_date: PropTypes.any,
  inv_no: PropTypes.any,
  selected: PropTypes.any,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func,
};
