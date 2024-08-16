import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  client,
  from,
  hotel,
  service_type,
  service_date,
  arb_dep,
  flight_no,
  flight_time,
  no_of_ngts,
  pickup_time,
  agency,
  adult,
  driver,
  guid,
  remarks,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {service_type}
            </Typography>
          </Stack>
        </TableCell> */}
        <TableCell>{client}</TableCell>
        <TableCell>{from}</TableCell>
        <TableCell>{hotel}</TableCell>
        <TableCell>{service_type}</TableCell>
        <TableCell>{service_date}</TableCell>
        <TableCell>{arb_dep}</TableCell>
        <TableCell>{flight_no}</TableCell>
        <TableCell>{flight_time}</TableCell>
        <TableCell>{pickup_time}</TableCell>
        <TableCell>{no_of_ngts}</TableCell>
        <TableCell>{agency}</TableCell>
        <TableCell>{adult}</TableCell>
        <TableCell>{driver}</TableCell>
        <TableCell>{guid}</TableCell>
        <TableCell>{remarks}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any,
  client: PropTypes.any,
  from: PropTypes.any,
  hotel: PropTypes.any,
  no_of_ngts: PropTypes.any,
  service_type: PropTypes.any,
  service_date: PropTypes.any,
  arb_dep: PropTypes.any,
  flight_no: PropTypes.any,
  flight_time: PropTypes.any,
  pickup_time: PropTypes.any,
  agency: PropTypes.any,
  adult: PropTypes.any,
  driver: PropTypes.any,
  guid: PropTypes.any,
  remarks: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
};
