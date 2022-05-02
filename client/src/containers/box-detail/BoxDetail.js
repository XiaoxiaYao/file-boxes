import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { retrieveBox, uploadFile } from '../../Api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../../components/boxContent/BoxContent.component';
import EditBox from '../../components/editBox/EditBox.component';

const BoxDetail = () => {
  const [box, setBox] = useState(null);
  const [displayEditBox, setDisplayEditBox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useContext(AuthContext);
  let params = useParams();

  const fetchBox = useCallback(async () => {
    const { data } = await retrieveBox(params.boxId);
    setBox(data);
  }, [params.boxId]);

  useEffect(() => {
    fetchBox();
  }, [fetchBox]);

  const handleClickEditButton = () => {
    setDisplayEditBox(true);
  };

  const handleBoxUpdated = () => {
    setDisplayEditBox(false);
    fetchBox();
  };

  const handleCloseUpdateBox = () => {
    setDisplayEditBox(false);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    const formData = new FormData();
    formData.append('file', selectedFile);
    setUploading(true);
    setErrorMessage('');
    try {
      await uploadFile(box._id, formData);
      event.target.value = null;
      fetchBox();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setUploading(false);
  };

  return (
    <Container>
      <Box p={2}>
        <Box mb={2}>
          <Typography variant="h6">Box:</Typography>
          {!box ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box py={2}>
              <Grid container justifyContent="space-between" spacing={4}>
                <Grid item xs={12} md={6}>
                  <BoxContent user={user} box={box} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  container
                  justifyContent="start"
                  alignItems="center"
                >
                  <Button onClick={handleClickEditButton}>Edit</Button>
                  <Button variant="contained" component="label">
                    Upload CSV File
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        {uploading && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Box>

      {displayEditBox && (
        <EditBox
          box={box}
          onBoxUpdated={handleBoxUpdated}
          onClose={handleCloseUpdateBox}
        />
      )}
    </Container>
  );
};

export default BoxDetail;
