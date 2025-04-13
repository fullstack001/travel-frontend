import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
// import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

dayjs.extend(utc);

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  onGetDate,
  onGetEndDate,
  filterName,
  onFilterName,
  onNewResa,
  loading,
  excelAction,
  pdfAction,
  searchOption,
  onSearchOptionChange,
  onSearch,
}) {
  const [open, setOpen] = useState(null);

  const handleDateChange = (newDate) => {
    const date = newDate ? dayjs(newDate).toDate() : null;
    const formattedDate = dayjs.utc(date).tz('Asia/Dubai');

    onGetDate(formattedDate);
  };

  const handleEndDateChange = (newDate) => {
    const date = newDate ? dayjs(newDate).toDate() : null;
    const formattedDate = dayjs.utc(date).tz('Asia/Dubai');

    onGetEndDate(formattedDate);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const exportPdf = () => {
    pdfAction();
    setOpen(null);
  };

  const exportExcel = () => {
    excelAction();
    setOpen(null);
  };

  const handleClearSearch = () => {
    onFilterName({ target: { value: '' } });
    onSearch(''); // Pass an empty string to trigger search with no filter
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(filterName);
    }
  };

  const handleClearSearchOption = () => {
    onSearchOptionChange({ target: { value: '' } });
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
        }}
      >
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="search-option-label">Search By</InputLabel>
          <Select
            labelId="search-option-label"
            value={searchOption}
            onChange={onSearchOptionChange}
            label="Search By"
            endAdornment={
              searchOption && (
                <IconButton size="small" sx={{ mr: 2 }} onClick={handleClearSearchOption}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              )
            }
          >
            <MenuItem value="client">Client Name</MenuItem>
            <MenuItem value="by">By</MenuItem>
            <MenuItem value="agency">Agency</MenuItem>
            <MenuItem value="agency_ref">Agency Reference</MenuItem>
          </Select>
        </FormControl>

        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          onKeyPress={handleKeyPress}
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
          endAdornment={
            filterName && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </InputAdornment>
            )
          }
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Start Date"
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                clearable: true,
                onClear: () => handleDateChange(null),
              },
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ ml: 4 }}>
          <DatePicker
            sx={{ ml: 4 }}
            label="Select End Date"
            onChange={handleEndDateChange}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                clearable: true,
                onClear: () => handleEndDateChange(null),
              },
            }}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={onNewResa}
          disabled={loading}
        >
          {loading ? 'Loading data...' : 'New Reservation'}
        </Button>
        <Button onClick={handleOpenMenu} sx={{ ml: 2 }} variant="contained" color="secondary">
          <Iconify icon="eva:more-vertical-fill" />
          Export Data
        </Button>
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
        <MenuItem onClick={exportPdf}>
          {/* <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} /> */}
          PDF
        </MenuItem>

        <MenuItem onClick={exportExcel} sx={{ color: 'error.main' }}>
          {/* <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} /> */}
          EXCEL
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onNewResa: PropTypes.func,
  loading: PropTypes.any,
  pdfAction: PropTypes.func,
  excelAction: PropTypes.func,
  onGetDate: PropTypes.func,
  onGetEndDate: PropTypes.func,
  searchOption: PropTypes.string.isRequired,
  onSearchOptionChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
