import React from 'react';
import { Typography, Box, Grid, Chip, Button } from '@mui/material';
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
        <>
          <Grid container direction="column" spacing={1}>
            <Grid item container spacing={1}>
              <Grid item>
                <AttachmentIcon />
              </Grid>
              <Grid item>
                <Chip label={box.file.name} color="secondary" size="small" />
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
          </Grid>
        </>
      )}
    </Box>
  );
};

export default BoxContent;
