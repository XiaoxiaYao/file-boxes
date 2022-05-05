import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CancelIcon from '@mui/icons-material/Cancel';
import { updateBox } from '../../Api';

const UpdateBox = ({ box, onBoxUpdated, onClose }) => {
  const [name, setName] = useState(box.name);
  const [description, setDescription] = useState(box.description);
  const [errorMessage, setErrorMessage] = useState(null);
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
  const [boxUpdated, setBoxUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClose = () => {
    if (boxUpdated) {
      onBoxUpdated();
    } else {
      onClose();
    }
  };

  const handleClickUpdateBoxButton = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await updateBox({ boxId: box._id, name, description });
      setDisplaySuccessAlert(true);
      setBoxUpdated(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open onClose={handleOnClose} fullWidth>
      <Box p={2} component="form" onSubmit={handleClickUpdateBoxButton}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
        >
          <Typography variant="h6" component="span">
            Edit Box
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
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              size="small"
              loading={isLoading}
            >
              Update Box
            </LoadingButton>
          </Box>
        </DialogActions>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={displaySuccessAlert}
          autoHideDuration={3000}
          onClose={() => {
            setDisplaySuccessAlert(false);
            onBoxUpdated();
          }}
        >
          <Alert severity="success">Box updated successfully!</Alert>
        </Snackbar>
      </Box>
    </Dialog>
  );
};

export default UpdateBox;
