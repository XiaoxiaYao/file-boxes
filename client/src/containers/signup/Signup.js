import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { signup } from '../../Api';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_ROUTES } from '../../Constants';
import { AuthContext } from '../../contexts/authContext';
import { Link as RouterLink } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  let navigate = useNavigate();

  const handleClickSignupButton = async (event) => {
    event.preventDefault();
    // TODO: Do client form validation
    setErrorMessage('');
    setIsLoading(true);
    try {
      const { data } = await signup({ email, password });
      setUser(data);
      navigate(APPLICATION_ROUTES.SIGNIN);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box mt={2}>
        <Paper>
          <Box p={2} component="form" onSubmit={handleClickSignupButton}>
            <Typography variant="h6">Sign Up</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
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
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                loading={isLoading}
              >
                Sign Up
              </LoadingButton>
            </Box>
            <Box py={1.5}>
              {'Already have an account? Go to '}
              <Link component={RouterLink} to={APPLICATION_ROUTES.SIGNIN}>
                Signin
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
