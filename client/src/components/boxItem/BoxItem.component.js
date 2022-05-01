import React, { useContext } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { AuthContext } from '../../contexts/authContext';

const BoxItem = ({ box, handleClick }) => {
  const { user, setUser } = useContext(AuthContext);

  return (
    <Box mb={2}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          {box.private ? (
            user &&
            box.accessAllowedUser.filter(
              (allowedUser) => allowedUser._id == user._id,
            ).length > 0 ? (
              <FolderSharedIcon fontSize="small" />
            ) : (
              <LockIcon fontSize="small" />
            )
          ) : (
            <LockOpenIcon fontSize="small" />
          )}
          <Typography variant="subtitle1" component="div">
            {box.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            {box.description}
          </Typography>
          {box.file && <AttachmentIcon />}
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
