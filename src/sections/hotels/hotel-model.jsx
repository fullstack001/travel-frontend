import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Stack,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const initData = {
  hotel_id: '',
  name: '',
  h_group: '',
  h_addr: '',
  h_region: '',
  h_plan_region: '',
  _id: '',
};

export default function Hotel({ open, onClose, onSave, initialData, maxNumber }) {
  const [formData, setFormData] = useState(initData);

  useEffect(() => {
    console.log(maxNumber);
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({ ...initData, hotel_id: maxNumber + 1 });
    }
  }, [initialData, maxNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const savedData = { ...formData }; // Ensure immutability by copying formData
    onSave(savedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {initialData ? 'Edit Hotel' : 'New Hotel'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel No"
                name="hotel_id"
                value={formData.hotel_id}
                onChange={handleChange}
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Group"
                name="h_group"
                value={formData.h_group}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Address"
                name="h_addr"
                value={formData.h_addr}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Region"
                name="h_region"
                value={formData.h_region}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Plan Region"
                name="h_plan_region"
                value={formData.h_plan_region}
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

Hotel.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
};
