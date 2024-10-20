import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Grid,
  Stack,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import userStore from 'src/store/userStroe';

import { formatTime } from './utils';

const initData = {
  _id: '',
  dossier_no: '',
  verified: 'false',
  status: 'OK',
  service: null,
  service_type: null,
  agency_ref: '',
  client: null,
  agency: null,
  from: null,
  to: null,
  excursion: '',
  service_date: '',
  flight_no: '',
  flight_time: '',
  adult: '',
  child: '',
  infant: '',
  teen: '',
  resa_remark: '',
  from_region: null,
  to_region: null,
  vehicle_type: null,
  invoice_no: '',
  amount: '',
  adult_price: '',
  child_price: '',
  teen_price: '',
  total_price: '',
  currency: 'USD',
  last_update: '',
};

const verifyUserList = [
  'Angelique',
  'Arielle',
  'Jenny M',
  'Magda',
  'Karen',
  'Jenny A',
  'Walyd',
  'Mkaribu',
];

export default function ResaModal({
  open,
  onClose,
  onSave,
  initialData,
  maxNumber,
  hotel,
  agency,
  service,
  vehicle,
}) {
  const [formData, setFormData] = useState(initData);
  const { name: userName } = userStore();
  console.log(userName);

  function formatTimeToString(time) {
    const d = new Date(time);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        flight_time: formatTime(initialData.flight_time),
      });
    } else {
      setFormData({ ...initData, dossier_no: maxNumber + 1, by: userName });
    }
  }, [initialData, maxNumber, userName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Update region when "from" or "to" changes
    if (name === 'from' || name === 'to') {
      const selectedHotel = hotel.find((item) => item.name === value);
      if (selectedHotel) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          [`${name}_region`]: selectedHotel.h_region,
        }));
      }
    }

    // Update agency_ref when agency changes
    if (name === 'agency') {
      console.log(value);
      const selectedAgency = agency.find((item) => item.name === value);
      console.log('---------------', selectedAgency);
      if (selectedAgency) {
        setFormData((prevData) => ({
          ...prevData,
          agency: value,
          agency_ref: selectedAgency.ref,
        }));
      }
    }
  };

  const handleSave = () => {
    const savedData = { ...formData }; // Ensure immutability by copying formData
    Object.entries(savedData).forEach(([key, value]) => {
      if (value instanceof Date) {
        const date = new Date(value);
        const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

        const newDate =
          timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : value;

        savedData[key] = newDate;
      } else {
        const time = Date.parse(`1970-01-01T${value}`);
        if (!Number.isNaN(time)) {
          savedData[key] = formatTimeToString(time);
        }
      }
    });
    onSave(savedData);
    onClose();
  };

  const agencyOptions = agency.map((item) => ({
    label: item.name,
    value: item.name,
  }));
  const hotelOptions = hotel.map((item) => ({
    label: item.name,
    value: item.name,
  }));
  const serviceOptions = service.map((item) => ({ label: item.name, value: item.name }));
  const vehicleOptions = vehicle.map((item) => ({ label: item.name, value: item.name }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {initialData ? 'Edit Reservation' : 'New Reservation'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            General Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dossier No"
                name="dossier_no"
                disabled
                value={formData.dossier_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="By"
                name="by"
                value={formData.by}
                disabled
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="verified-label">Verified</InputLabel>
                <Select
                  labelId="verified-label"
                  label="Verified"
                  name="verified"
                  value={formData.verified}
                  onChange={handleChange}
                  disabled={!verifyUserList.includes(userName)}
                >
                  <MenuItem value="false">Not Verified</MenuItem>
                  <MenuItem value="true">Verified</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="OK">Confirmed</MenuItem>
                  <MenuItem value="No">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={agencyOptions}
                getOptionLabel={(option) => option.label.toUpperCase()}
                value={agencyOptions.find((option) => option.value === formData.agency) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'agency',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Agency" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Agency Ref"
                name="agency_ref"
                value={formData.agency_ref}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Service Date"
                  name="service_date"
                  value={dayjs(formData.service_date)}
                  onChange={(date) =>
                    setFormData({ ...formData, service_date: date ? dayjs(date).toDate() : null })
                  }
                  minDate={dayjs()} // This sets the minimum selectable date to today
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Service Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={serviceOptions} // Array of options
                getOptionLabel={(option) => option.label.toUpperCase()} // Determines the string to display
                value={serviceOptions.find((option) => option.value === formData.service) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'service',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Service" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="service-type-label">Service Type</InputLabel>
                <Select
                  labelId="service-type-label"
                  label="Service Type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Arv">Arv</MenuItem>
                  <MenuItem value="Dep">Dep</MenuItem>
                  <MenuItem value="Inh">Inh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Flight No"
                name="flight_no"
                value={formData.flight_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Flight Time"
                name="flight_time"
                value={formData.flight_time}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions}
                getOptionLabel={(option) => option.label}
                value={hotelOptions.find((option) => option.value === formData.from) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'from',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="From" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Region From"
                name="from_region"
                value={formData.from_region || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions}
                getOptionLabel={(option) => option.label}
                value={hotelOptions.find((option) => option.value === formData.to) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'to',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="To" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Region To"
                name="to_region"
                value={formData.to_region || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={vehicleOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
                value={
                  vehicleOptions.find((option) => option.value === formData.type_vehicle) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'type_vehicle',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Type of Vehicle" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Remarks"
                name="resa_remark"
                value={formData.resa_remark}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Pricing Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Adult"
                name="adult"
                value={formData.adult}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Adult Price"
                name="adult_price"
                value={formData.adult_price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Child"
                name="child"
                value={formData.child}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Child Price"
                name="child_price"
                value={formData.child_price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teen"
                name="teen"
                value={formData.teen}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teen Price"
                name="teen_price"
                value={formData.teen_price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Infant"
                name="infant"
                value={formData.infant}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Total Price"
                name="total_price"
                value={
                  formData.adult_price * formData.adult +
                  formData.child_price * formData.child +
                  formData.teen_price * formData.teen
                }
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
                disabled
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  label="Currency"
                  name="cur"
                  value={formData.cur}
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="TZS">TZS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice No"
                name="inv_no"
                value={formData.inv_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ResaModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
  hotel: PropTypes.any,
  agency: PropTypes.any,
  service: PropTypes.any,
  vehicle: PropTypes.any,
};
