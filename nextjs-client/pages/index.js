import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { listBoxes } from '../Api';
import { APPLICATION_ROUTES } from '../Constants';
import { useRouter } from 'next/router';
import BoxItem from '../components/boxItem/BoxItem.component';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CreateBox from '../components/createBox/CreateBox.component';

const Home = (props) => {
  const [displayCreateBox, setDisplayCreateBox] = useState(false);

  let router = useRouter();
  const { boxes } = props;

  const handleClickCard = (box) => {
    router.push(`${APPLICATION_ROUTES.BOX}/${box._id}`);
  };

  const handleClickCreateBoxButton = () => {
    setDisplayCreateBox(true);
  };

  const handleBoxCreated = () => {
    setDisplayCreateBox(false);
    fetchBoxes();
  };

  const handleCloseCreateReview = () => {
    setDisplayCreateBox(false);
  };

  if (!boxes) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box p={2}>
        <Box mb={2}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">All Boxes</Typography>
            </Grid>
            <Grid item>
              <Fab
                color="primary"
                aria-label="add"
                variant="extended"
                onClick={handleClickCreateBoxButton}
              >
                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                Create a box
              </Fab>
            </Grid>
          </Grid>
        </Box>
        {boxes &&
          boxes.map((box) => (
            <BoxItem key={box._id} box={box} handleClick={handleClickCard} />
          ))}
      </Box>
      {displayCreateBox && (
        <CreateBox
          onBoxCreated={handleBoxCreated}
          onClose={handleCloseCreateReview}
        />
      )}
    </Container>
  );
};

export async function getStaticProps() {
  const { data } = await listBoxes();

  return {
    props: {
      boxes: data,
    },
    revalidate: 600,
  };
}

export default Home;
