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
import { shareBox } from '../../Api';

const ShareBox = ({ boxId, onBoxShared, onClose }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
  const [boxShared, setBoxShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClose = () => {
    if (boxShared) {
      onBoxShared();
    } else {
      onClose();
    }
  };

  const handleClickShareBoxButton = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await shareBox({ boxId, email });
      setDisplaySuccessAlert(true);
      setBoxShared(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open onClose={handleOnClose} fullWidth>
      <Box p={2} component="form" onSubmit={handleClickShareBoxButton}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
        >
          <Typography variant="h6" component="span">
            Share box to this user:
          </Typography>

          <IconButton onClick={onClose} color="error">
            <CancelIcon />
          </IconButton>
        </Grid>
        <Box mt={4}>
          <TextField
            label="His/Her email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
              Share it
            </LoadingButton>
          </Box>
        </DialogActions>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={displaySuccessAlert}
          autoHideDuration={3000}
          onClose={() => {
            setDisplaySuccessAlert(false);
            onBoxShared();
          }}
        >
          <Alert severity="success">Box shared successfully!</Alert>
        </Snackbar>
      </Box>
    </Dialog>
  );
};

export default ShareBox;
