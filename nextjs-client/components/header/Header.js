import React, { useContext } from 'react';
import {
  Avatar,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Popover,
  Grid,
  Link as MUILink,
} from '@mui/material';
import { AuthContext } from '../../contexts/authContext';
import { signout } from '../../Api';
import { APPLICATION_ROUTES } from '../../Constants';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, setUser } = useContext(AuthContext);
  const open = Boolean(anchorEl);
  const id = open ? 'avatar' : undefined;
  let router = useRouter();

  const handleClickAvatar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickSignoutButton = async () => {
    setAnchorEl(null);
    await signout();
    setUser(null);
    window.location.assign(APPLICATION_ROUTES.ROOT);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid alignItems="center" container>
            <MUILink
              href={APPLICATION_ROUTES.ROOT}
              color="inherit"
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                File Boxes
              </Typography>
            </MUILink>
            {user && user.isSuperUser && (
              <Box sx={{ flexGrow: 1, display: { sx: 'flex' } }} ml={2}>
                <Button
                  onClick={() => router.push(APPLICATION_ROUTES.USERS)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Users
                </Button>
              </Box>
            )}
          </Grid>
          {!user ? (
            <Link href={APPLICATION_ROUTES.SIGNIN} passHref>
              <MUILink color="inherit">Signin</MUILink>
            </Link>
          ) : (
            <Avatar aria-describedby={id} onClick={handleClickAvatar}>
              {user.email[0].toUpperCase()}
            </Avatar>
          )}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Button color="inherit" onClick={handleClickSignoutButton}>
              Sign out
            </Button>
          </Popover>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
