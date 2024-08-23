// import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

// import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ onGetDate, NewAction, showButton }) {
  const [open, setOpen] = useState(null);

  const handleDateChange = (newDate) => {
    const formattedDate = newDate.format('MM/DD/YYYY');
    onGetDate(formattedDate);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            // value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        {showButton !== null && (
          <Box sx={{ ml: 'auto' }}>
            {showButton !== null && (
              <>
                <Button
                  variant="contained"
                  onClick={NewAction}
                  color="inherit"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  New Daily Data
                </Button>

                <Button
                  onClick={handleOpenMenu}
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="secondary"
                >
                  <Iconify icon="eva:more-vertical-fill" />
                  Export Data
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          {/* <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} /> */}
          PDF
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          {/* <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} /> */}
          EXCEL
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableToolbar.propTypes = {
  onGetDate: PropTypes.func,
  NewAction: PropTypes.func,
  showButton: PropTypes.any,
};
