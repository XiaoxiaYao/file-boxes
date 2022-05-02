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
  Stack,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { retrieveBox, uploadFile, setToPublic } from '../../Api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../../components/boxContent/BoxContent.component';
import EditBox from '../../components/editBox/EditBox.component';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BoxDetail = () => {
  const [box, setBox] = useState(null);
  const [displayEditBox, setDisplayEditBox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSettingToPublic, setIsSettingToPublic] = useState(false);
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

  const handleSetToPublic = async () => {
    setIsSettingToPublic(true);
    try {
      await setToPublic(box._id);
      fetchBox();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsSettingToPublic(false);
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
                  <Stack spacing={1} direction="column">
                    <Button
                      variant="contained"
                      onClick={handleClickEditButton}
                      startIcon={<EditIcon />}
                      color="warning"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<FileUploadIcon />}
                      color="secondary"
                    >
                      Upload CSV File
                      <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {box.private && (
                      <LoadingButton
                        variant="contained"
                        color="error"
                        loading={isSettingToPublic}
                        onClick={handleSetToPublic}
                        startIcon={<VisibilityIcon />}
                      >
                        Set to public
                      </LoadingButton>
                    )}
                  </Stack>
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
