import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Grid,
  Rating,
  TextField,
  DialogActions,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { createBox } from '../../Api';

const CreateBox = ({ onBoxCreated, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
  const [boxCreated, setBoxCreated] = useState(false);

  const handleOnClose = () => {
    if (boxCreated) {
      onBoxCreated();
    } else {
      onClose();
    }
  };

  const handleClickCreateBoxButton = async (event) => {
    event.preventDefault();
    try {
      await createBox({ name, description });
      setDisplaySuccessAlert(true);
      setBoxCreated(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <Dialog open onClose={handleOnClose} fullWidth>
      <Box p={2} component="form" onSubmit={handleClickCreateBoxButton}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
        >
          <Typography variant="h6" component="span">
            New Box
          </Typography>

          <IconButton onClick={onClose} color="error">
            <CancelIcon />
          </IconButton>
        </Grid>
        <Box mt={4}>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            margin="normal"
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            margin="normal"
            required
            fullWidth
          />
        </Box>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <DialogActions>
          <Box mt={2}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="small"
            >
              Create Box
            </Button>
          </Box>
        </DialogActions>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={displaySuccessAlert}
          autoHideDuration={6000}
          onClose={() => {
            setDisplaySuccessAlert(false);
            onBoxCreated();
          }}
        >
          <Alert severity="success">Box created successfully!</Alert>
        </Snackbar>
      </Box>
    </Dialog>
  );
};

export default CreateBox;
