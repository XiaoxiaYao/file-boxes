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
import { retrieveBox, uploadFile, setToPublic, deleteBox } from '../../Api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../../components/boxContent/BoxContent.component';
import EditBox from '../../components/editBox/EditBox.component';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_ROUTES } from '../../Constants';

const BoxDetail = () => {
  const [box, setBox] = useState(null);
  const [displayEditBox, setDisplayEditBox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSettingToPublic, setIsSettingToPublic] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useContext(AuthContext);
  let params = useParams();
  let navigate = useNavigate();

  const fetchBox = useCallback(async () => {
    try {
      const { data } = await retrieveBox(params.boxId);
      setBox(data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
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

  const handleDeleteBox = async () => {
    setIsDeleting(true);
    try {
      await deleteBox(box._id);
      navigate(APPLICATION_ROUTES.ROOT);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsDeleting(false);
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
                    {box.owner &&
                      (box.owner._id === user._id || box.owner.isSuperUser) && (
                        <LoadingButton
                          variant="contained"
                          color="error"
                          loading={isDeleting}
                          onClick={handleDeleteBox}
                          startIcon={<VisibilityIcon />}
                        >
                          Delete box
                        </LoadingButton>
                      )}
                    <LoadingButton
                      variant="contained"
                      color="error"
                      loading={isDeleting}
                      onClick={handleDeleteBox}
                      startIcon={<VisibilityIcon />}
                    >
                      Delete box
                    </LoadingButton>
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
