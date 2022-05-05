import React, { useState, useEffect } from 'react';
import { Container, Box, CircularProgress, Alert } from '@mui/material';
import { listUsers, deleteUser } from '../../Api';
import UserItem from '../../components/userItem/UserItem.component';

const Users = () => {
  const [users, setUsers] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userBeingDeleted, setUserBeingDeleted] = useState(null);

  const fetchUsers = async () => {
    setIsLoadingData(true);
    const { data } = await listUsers();
    setUsers(data);
    setIsLoadingData(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClickDelete = async (user) => {
    setUserBeingDeleted(user);
    try {
      await deleteUser(user._id);
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setUserBeingDeleted(null);
  };

  return (
    <Container>
      <Box p={2}>
        {isLoadingData ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : (
          users &&
          users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handleClick={handleClickDelete}
              isLoading={userBeingDeleted && userBeingDeleted._id === user._id}
            />
          ))
        )}
      </Box>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Container>
  );
};

export default Users;
