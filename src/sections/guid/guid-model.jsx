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
  guid_id: '',
  name: '',
  _id: '',
};

export default function GuidModal({ open, onClose, onSave, initialData, maxNumber }) {
  const [formData, setFormData] = useState(initData);

  useEffect(() => {
    console.log(maxNumber);
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({ ...initData, guid_id: maxNumber + 1 });
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
            <Grid item xs={12} sm={12}>
              <TextField
                label="Service No"
                name="guid_id"
                value={formData.guid_id}
                onChange={handleChange}
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Service Name"
                name="name"
                value={formData.name}
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

GuidModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
};
