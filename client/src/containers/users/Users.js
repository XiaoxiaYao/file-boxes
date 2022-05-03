import React, { useState, useEffect } from 'react';
import { Container, Box, CircularProgress, Alert } from '@mui/material';
import { listUsers, deleteUser } from '../../Api';
import UserItem from '../../components/userItem/UserItem.component';

const Users = () => {
  const [users, setUsers] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchUsers = async () => {
    const { data } = await listUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClickDelete = async (user) => {
    try {
      await deleteUser(user._id);
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <Container>
      <Box p={2}>
        {!users ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : (
          users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handleClick={handleClickDelete}
            />
          ))
        )}
      </Box>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Container>
  );
};

export default Users;
