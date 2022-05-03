import React from 'react';
import { Card, CardContent, CardActions, Button, Box } from '@mui/material';

const UserItem = ({ user, handleClick }) => {
  return (
    <Box mb={2}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>{user.email}</CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleClick(user)} color="error">
            Delete
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default UserItem;
