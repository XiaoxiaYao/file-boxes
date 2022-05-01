import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { listBoxes } from '../../Api';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_ROUTES } from '../../Constants';
import BoxItem from '../../components/boxItem/BoxItem.component';

const Home = () => {
  const [boxes, setBoxes] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    const fetchBoxes = async () => {
      const { data } = await listBoxes();
      setBoxes(data);
    };
    fetchBoxes();
  }, []);

  const handleClickCard = () => {};

  return (
    <Container>
      <Box p={2}>
        <Box mb={2}>
          <Typography variant="h6">All Boxes</Typography>
        </Box>
        {!boxes ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : (
          boxes.map((box) => (
            <BoxItem key={box._id} box={box} handleClick={handleClickCard} />
          ))
        )}
      </Box>
    </Container>
  );
};

export default Home;
