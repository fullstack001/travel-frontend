import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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

const initData = {
  adult: '',
  adult_price: '',
  agency: '',
  arb_dep: '',
  cash_credit: '',
  child: '',
  child_price: '',
  client: '',
  cur: '',
  date: '',
  dossier_no: '',
  effect_date: '',
  endofservice: '',
  flight_no: '',
  flight_time: '',
  free: '',
  from: '',
  hotel: '',
  htl_region: '',
  infant: '',
  inv_no: '',
  invoce_on: '',
  net_price: '',
  no_of_ngts: '',
  resa_remark: '',
  roe: '',
  service: '',
  service_date: '',
  service_detail: '',
  service_type: '',
  status: '',
  teen: '',
  teen_price: '',
  total_price: '',
  _id: '',
};

export default function ResaModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initData);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';

    // Split the time into components
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    // Convert to 24-hour format
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    // Ensure double digits for hours and minutes
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    return `${hours}:${minutes}`;
  };

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
        service_date: formatDate(initialData.service_date),
        endofservice: formatDate(initialData.endofservice),
        flight_time: formatTime(initialData.flight_time),
        invoce_on: formatDate(initialData.invoce_on),
      });
    } else {
      setFormData(initData);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const savedData = formData;
    Object.entries(savedData).forEach(([key, value]) => {
      const time = Date.parse(`1970-01-01T${value}`);
      if (!Number.isNaN(time)) {
        savedData[key] = formatTimeToString(value);
      }
    });

    onSave(savedData);
    onClose();
  };

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
                label="Agency"
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                fullWidth
                variant="outlined"
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
                label="Service Date"
                name="service_date"
                value={formData.service_date}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End of Service"
                name="endofservice"
                value={formData.endofservice}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Service Details
          </Typography>
          <Grid container spacing={2}>
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
                label="From"
                name="from"
                value={formData.from}
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
                label="Hotel"
                name="hotel"
                value={formData.hotel}
                onChange={handleChange}
                fullWidth
                variant="outlined"
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
                label="Service Detail"
                name="service_detail"
                value={formData.service_detail}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Net Price"
                name="net_price"
                value={formData.net_price}
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
                label="Cash/Credit"
                name="cash_credit"
                value={formData.cash_credit}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ROE"
                name="roe"
                value={formData.roe}
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
              <TextField
                label="Invoice On"
                name="invoce_on"
                value={formData.invoce_on}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Free"
                name="free"
                value={formData.free}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
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
};
