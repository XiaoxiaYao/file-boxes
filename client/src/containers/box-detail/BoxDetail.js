import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
} from '@mui/material';
import { retrieveBox } from '../../Api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../../components/boxContent/BoxContent.component';
import EditBox from '../../components/editBox/EditBox.component';

const BoxDetail = () => {
  const [box, setBox] = useState(null);
  const [displayEditBox, setDisplayEditBox] = useState(false);

  const { user } = useContext(AuthContext);
  let params = useParams();

  const fetchBox = async () => {
    const { data } = await retrieveBox(params.boxId);
    setBox(data);
  };

  useEffect(() => {
    fetchBox();
  }, [params.boxId]);

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
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <BoxContent user={user} box={box} />
                </Grid>
                <Grid item xs={6} container justifyContent="end">
                  <Button onClick={handleClickEditButton}>Edit</Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
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
