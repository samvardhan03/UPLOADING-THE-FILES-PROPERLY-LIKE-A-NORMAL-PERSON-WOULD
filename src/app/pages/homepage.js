import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Typography, Button, Modal, TextField, CircularProgress, Alert } from '@mui/material';
import Card from '@mui/material/Card';
import Mosaicstyles from '../styles/mosaicstyles.module.css';

export default function Homepage(props) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setResponse(null);
    setError(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await fetch('http://your-backend-url/api/scan-medicine/', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to scan medicine. Please try again.');
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
            Welcome to your <span style={{ color: '#2027C5' }}>Dashboard</span>
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
          <Button
            sx={{
              backgroundColor: '#F1F3FF',
              color: 'black',
              border: '3px solid #2027C5',
              borderRadius: '25px',
              px: 3,
              py: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
            variant="contained"
            onClick={handleOpen}
          >
            Scan medicine
          </Button>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            borderRadius: '10px',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Scan Medicine
          </Typography>
          <TextField
            type="file"
            inputProps={{ accept: 'image/*' }}
            onChange={handleImageChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          {image && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected: {image.name}
            </Typography>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {response && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Medicine:</strong> {response.medicine_name || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Details:</strong> {response.details || 'No details available'}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#5C6AFF',
              color: 'white',
              borderRadius: '10px',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
            onClick={handleUpload}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Upload and Scan'}
          </Button>
        </Box>
      </Modal>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {[
          { title: 'Total medicines', value: '4230' },
          { title: 'Damaged stock', value: '23' },
          { title: 'Expiring soon', value: '1' },
          { title: 'Warnings', value: '0' },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                color: '#2027C5',
                border: 3,
                borderRadius: '30px',
                p: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {item.title}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
          Recent <span style={{ color: '#2027C5' }}>Activity</span>
        </Typography>
        {[
          { name: 'Aspirin', details: '+12 units, 12/2/2025' },
          { name: 'Loratadine', details: '-2 units, 8/2/2025' },
          { name: 'Acetaminophine', details: '-4 units, 12/2/2025' },
          { name: 'Ibuprofen', details: 'Stock verification, 21/1/2025' },
        ].map((activity, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {activity.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#637387', fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {activity.details}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}