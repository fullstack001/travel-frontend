import { useState } from 'react';
import PropTypes from 'prop-types';

// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import userStore from 'src/store/userStroe'; // import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { formatTime } from './utils';

function formatDateToString(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  dossier_no,
  by,
  verified,
  status,
  service,
  service_type,
  agency_ref,
  client,
  agency,
  from,
  to,
  excursion,
  service_date,
  flight_no,
  flight_time,
  adult,
  child,
  infant,
  teen,
  resa_remark,
  from_region,
  to_region,
  vehicle_type,
  invoice_no,
  amount,
  adult_price,
  child_price,
  teen_price,
  total_price,
  cur,
  last_update,
  editAction,
  deleteAction,
}) {
  const { role } = userStore();
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
        <TableCell>{dossier_no}</TableCell>
        <TableCell>{by}</TableCell>
        <TableCell>{verified ? 'Yes' : 'No'}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{service}</TableCell>
        <TableCell>{service_type}</TableCell>
        <TableCell>{agency_ref}</TableCell>
        <TableCell>{client}</TableCell>
        <TableCell>{agency}</TableCell>
        <TableCell>{from}</TableCell>
        <TableCell>{to}</TableCell>
        <TableCell>{excursion}</TableCell>
        <TableCell>{formatDateToString(service_date)}</TableCell>
        <TableCell>{flight_no}</TableCell>
        <TableCell>{formatTime(flight_time)}</TableCell>
        <TableCell>{adult}</TableCell>
        <TableCell>{child}</TableCell>
        <TableCell>{infant}</TableCell>
        <TableCell>{teen}</TableCell>
        <TableCell>{resa_remark}</TableCell>
        <TableCell>{from_region}</TableCell>
        <TableCell>{to_region}</TableCell>
        <TableCell>{vehicle_type}</TableCell>
        <TableCell>{invoice_no}</TableCell>
        <TableCell>{amount}</TableCell>
        <TableCell>{adult_price}</TableCell>
        <TableCell>{child_price}</TableCell>
        <TableCell>{teen_price}</TableCell>
        <TableCell>{total_price}</TableCell>
        <TableCell>{cur}</TableCell>
        <TableCell>{formatDateToString(last_update)}</TableCell>
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
        {role === 'admin' && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any,
  dossier_no: PropTypes.any,
  verified: PropTypes.any,
  status: PropTypes.any,
  service: PropTypes.any,
  service_type: PropTypes.any,
  agency_ref: PropTypes.any,
  client: PropTypes.any,
  agency: PropTypes.any,
  from: PropTypes.any,
  to: PropTypes.any,
  excursion: PropTypes.any,
  service_date: PropTypes.any,
  flight_no: PropTypes.any,
  flight_time: PropTypes.any,
  adult: PropTypes.any,
  child: PropTypes.any,
  infant: PropTypes.any,
  teen: PropTypes.any,
  resa_remark: PropTypes.any,
  from_region: PropTypes.any,
  to_region: PropTypes.any,
  vehicle_type: PropTypes.any,
  invoice_no: PropTypes.any,
  amount: PropTypes.any,
  adult_price: PropTypes.any,
  child_price: PropTypes.any,
  teen_price: PropTypes.any,
  total_price: PropTypes.any,
  cur: PropTypes.any,
  selected: PropTypes.any,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func,
  by: PropTypes.any,
  last_update: PropTypes.any,
};
