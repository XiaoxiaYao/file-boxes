import React from 'react';
import { Card, CardContent, CardActions, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const UserItem = ({ user, handleClick, isLoading }) => {
  return (
    <Box mb={2}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>{user.email}</CardContent>
        <CardActions>
          <LoadingButton
            size="small"
            onClick={() => handleClick(user)}
            color="error"
            loading={isLoading}
          >
            Delete
          </LoadingButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default UserItem;
