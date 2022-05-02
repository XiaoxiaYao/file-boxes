import React from 'react';
import { Typography, Box, Grid, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
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
      <Box>
        <Typography variant="button" component="span">
          {`Name: `}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {box.name}
        </Typography>
      </Box>
      <Box>
        <Typography variant="button" component="span">
          {`Description: `}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="span">
          {box.description}
        </Typography>
      </Box>

      {box.file && (
        <Box>
          <Grid container>
            <Typography variant="button" component="span">
              {`File Name: `}
            </Typography>
          </Grid>
          <Grid container wrap="nowrap" spacing={1}>
            <Grid item xs>
              <Typography style={{ wordWrap: 'break-word' }}>
                {box.file.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Box mt={1}>
              <Button
                variant="outlined"
                size="small"
                href={box.file.url}
                startIcon={<CloudDownloadIcon fontSize="small" />}
              >
                Click to download
              </Button>
            </Box>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default BoxContent;
