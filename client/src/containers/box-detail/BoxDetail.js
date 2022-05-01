import React, { useState, useEffect, useContext } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { retrieveBox } from '../../Api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../../components/boxContent/BoxContent.component';

const BoxDetail = () => {
  const [box, setBox] = useState(null);

  const { user } = useContext(AuthContext);
  let params = useParams();

  useEffect(() => {
    const fetchBox = async () => {
      const { data } = await retrieveBox(params.boxId);
      setBox(data);
    };
    fetchBox();
  }, [params.boxId]);

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
              <BoxContent user={user} box={box} />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BoxDetail;
