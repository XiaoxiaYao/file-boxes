import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  Paper,
  Alert,
  Link as MUILink,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { signin } from '../Api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { APPLICATION_ROUTES } from '../Constants';
import { AuthContext } from '../contexts/authContext';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const { setUser } = useContext(AuthContext);

  let router = useRouter();

  const handleClickSigninButton = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSigning(true);
    try {
      const { data } = await signin({ email, password });
      setUser(data);
      router.push(APPLICATION_ROUTES.ROOT);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsSigning(false);
  };

  return (
    <Container maxWidth="xs">
      <Box mt={2}>
        <Paper>
          <Box p={2} component="form" onSubmit={handleClickSigninButton}>
            <Typography variant="h6">Sign In</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              name="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Box my={2}>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                loading={isSigning}
              >
                Sign In
              </LoadingButton>
            </Box>
            <Box py={1.5}>
              {"Don't have an account? Go to "}
              <Link href={APPLICATION_ROUTES.SIGNUP} passHref>
                <MUILink>Signup</MUILink>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signin;
