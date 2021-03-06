import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { retrieveBox, uploadFile, setToPublic, deleteBox } from '../../Api';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../../components/boxContent/BoxContent.component';
import EditBox from '../../components/editBox/EditBox.component';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { APPLICATION_ROUTES } from '../../Constants';
import ShareBox from '../../components/shareBox/ShareBox.component';
import PreviewIcon from '@mui/icons-material/Preview';
import PreviewBox from '../../components/boxPreview/PreviewBox.component';
import { useRouter } from 'next/router';
import Router from 'next/router';
import axios from 'axios';

const BoxDetail = (props) => {
  const [displayEditBox, setDisplayEditBox] = useState(false);
  const [displayShareBox, setDisplayShareBox] = useState(false);
  const [displayPreviewFile, setDisplayPreviewFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSettingToPublic, setIsSettingToPublic] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { box } = props;

  const { user } = useContext(AuthContext);
  let router = useRouter();

  const handleClickEditButton = () => {
    setDisplayEditBox(true);
  };

  const handleBoxUpdated = () => {
    setDisplayEditBox(false);
    Router.reload();
  };

  const handleCloseUpdateBox = () => {
    setDisplayEditBox(false);
  };

  const handleClickShareButton = () => {
    setDisplayShareBox(true);
  };

  const handleBoxShared = () => {
    setDisplayShareBox(false);
    Router.reload();
  };

  const handleCloseShareBox = () => {
    setDisplayShareBox(false);
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
      Router.reload();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setUploading(false);
  };

  const handleSetToPublic = async () => {
    setIsSettingToPublic(true);
    try {
      await setToPublic(box._id);
      Router.reload();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsSettingToPublic(false);
  };

  const handleDeleteBox = async () => {
    setIsDeleting(true);
    try {
      await deleteBox(box._id);
      router.push(APPLICATION_ROUTES.ROOT);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsDeleting(false);
  };

  const handleClickPreviewButton = () => {
    setDisplayPreviewFile(true);
  };

  const handleClosePreviewFile = () => {
    setDisplayPreviewFile(false);
  };

  if (!box) {
    return (
      <Container>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Box p={2}>No box detail.</Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Box p={2}>
        <Box mb={2}>
          <Typography variant="h6">Box</Typography>
          {box && (
            <Box py={2}>
              <Grid container justifyContent="space-between" spacing={4}>
                <Grid item xs={12} md={6}>
                  <BoxContent user={user} box={box} />
                  {box.accessAllowedUser.length > 0 && (
                    <Box mt={2}>
                      <Box mb={1}>
                        <Typography variant="button" component="span">
                          {`Shared With: `}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        {box.accessAllowedUser.map((accessAllowedUser) => (
                          <Chip
                            key={accessAllowedUser._id}
                            label={accessAllowedUser.email}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  container
                  justifyContent="center"
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
                    {box.file && (
                      <Button
                        variant="contained"
                        onClick={handleClickPreviewButton}
                        startIcon={<PreviewIcon />}
                        color="success"
                      >
                        Preview the file
                      </Button>
                    )}
                    {box.private && box.owner._id === user._id && (
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
                    {((box.private && box.owner._id === user._id) ||
                      (user && user.isSuperUser)) && (
                      <LoadingButton
                        variant="contained"
                        color="error"
                        loading={isDeleting}
                        onClick={handleDeleteBox}
                        startIcon={<DeleteForeverIcon />}
                      >
                        Delete box
                      </LoadingButton>
                    )}
                    {box.private && box.owner._id === user._id && (
                      <Button
                        variant="contained"
                        onClick={handleClickShareButton}
                        startIcon={<ShareIcon />}
                        color="success"
                      >
                        Share
                      </Button>
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
      {displayShareBox && (
        <ShareBox
          boxId={box._id}
          onBoxShared={handleBoxShared}
          onClose={handleCloseShareBox}
        />
      )}
      {displayPreviewFile && (
        <PreviewBox box={box} onClose={handleClosePreviewFile} />
      )}
    </Container>
  );
};

export async function getServerSideProps(context) {
  axios.defaults.headers = context.req.headers;
  const { params } = context;

  const boxId = params.boxId;
  const { data } = await retrieveBox(boxId);

  return {
    props: {
      box: data,
    },
  };
}

export default BoxDetail;
