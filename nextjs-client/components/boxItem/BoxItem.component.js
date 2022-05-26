import React, { useContext } from 'react';
import { Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { AuthContext } from '../../contexts/authContext';
import BoxContent from '../boxContent/BoxContent.component';

const BoxItem = ({ box, handleClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <Box mb={2}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <BoxContent user={user} box={box} />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleClick(box)}>
            More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default BoxItem;
