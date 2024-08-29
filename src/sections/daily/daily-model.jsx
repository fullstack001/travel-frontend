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
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { formatTime } from './utils';

const initData = {
  adult: '',
  adult_price: '',
  agency_ref_no: '',
  agency: null,
  arb_dep: '',
  pickup_time: '',
  child: '',
  child_price: '',
  client: '',
  cur: '',
  date: '',
  type_vehicle: '',
  dossier_no: '',
  effect_date: '',
  endofservice: '',
  flight_no: '',
  flight_time: '',
  from: null,
  hotel: null,
  htl_region: '',
  infant: '',
  invoce_on: '',
  resa_remark: '',
  service: null,
  service_date: '',
  service_detail: '',
  service_type: '',
  status: '',
  total_price: '',
  driver: '',
  guid: '',
  _id: '',
};

export default function DailyModal({
  open,
  onClose,
  onSave,
  initialData,
  maxNumber,
  hotel,
  agency,
  service,
}) {
  const [formData, setFormData] = useState(initData);

  function formatTimeToString(time) {
    const d = new Date(time);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    console.log(maxNumber);
    if (initialData) {
      setFormData({
        ...initialData,
        flight_time: formatTime(initialData.flight_time),
        pickup_time: formatTime(initialData.pickup_time),
        driver: initialData.driver ? initialData.driver : '',
        guid: initialData.guid ? initialData.guid : '',
      });
    } else {
      setFormData({ ...initData, dossier_no: maxNumber + 1 });
    }
  }, [initialData, maxNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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

  const agencyOptions = agency.map((item) => ({ label: item.name, value: item.name }));
  const hotelOptions = hotel.map((item) => ({ label: item.name, value: item.name }));
  const serviceOptions = service.map((item) => ({ label: item.name, value: item.name }));

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
                value={formData.dossier_no}
                disabled
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
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
              <TextField
                label="Agency Reference no"
                name="agency_ref_no"
                value={formData.agency_ref_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={agencyOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Service Date"
                  name="service_date"
                  value={dayjs(formData.service_date)}
                  onChange={(date) =>
                    setFormData({ ...formData, service_date: date ? dayjs(date).toDate() : null })
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End of Service"
                  name="endofservice"
                  value={dayjs(formData.endofservice)}
                  onChange={(date) =>
                    setFormData({ ...formData, endofservice: date ? dayjs(date).toDate() : null })
                  }
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
                getOptionLabel={(option) => option.label} // Determines the string to display
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
              <TextField
                label="Service Type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Arrival/Departure"
                name="arb_dep"
                value={formData.arb_dep}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
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
              <TextField
                label="Pickup Time"
                name="pickup_time"
                value={formData.pickup_time}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
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
              <Autocomplete
                options={hotelOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
                value={hotelOptions.find((option) => option.value === formData.hotel) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'hotel',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Hotel" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Region"
                name="htl_region"
                value={formData.htl_region}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Type of Vehicle"
                name="type_vehicle"
                value={formData.type_vehicle}
                onChange={handleChange}
                fullWidth
                variant="outlined"
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Price"
                name="total_price"
                value={formData.total_price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Currency"
                name="cur"
                value={formData.cur}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Effect Date"
                  name="effect_date"
                  value={dayjs(formData.effect_date)}
                  onChange={(date) =>
                    setFormData({ ...formData, effect_date: date ? dayjs(date).toDate() : null })
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Driver Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Driver"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guid"
                name="guid"
                value={formData.guid}
                onChange={handleChange}
                fullWidth
                variant="outlined"
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

DailyModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
  hotel: PropTypes.any,
  agency: PropTypes.any,
  service: PropTypes.any,
};
