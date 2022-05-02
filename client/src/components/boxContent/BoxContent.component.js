import React from 'react';
import { Typography, Box, Grid, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const BoxContent = ({ box, user }) => {
  return (
    <Box>
      {box.private ? (
        user &&
        box.accessAllowedUser.filter(
          (allowedUser) => allowedUser._id === user._id,
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

      {box.file && (
        <Box>
          <Grid item>
            <AttachmentIcon />
          </Grid>
          <Grid container wrap="nowrap" spacing={1}>
            <Grid item xs>
              <Typography style={{ wordWrap: 'break-word' }}>
                {box.file.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              href={box.file.url}
              startIcon={<CloudDownloadIcon fontSize="small" />}
            >
              Click to download
            </Button>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default BoxContent;
