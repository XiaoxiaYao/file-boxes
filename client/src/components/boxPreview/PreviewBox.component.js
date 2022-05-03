import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  Box,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Grid,
} from '@mui/material';
import Papa from 'papaparse';

const PreviewBox = ({ box, onClose }) => {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchCSV = useCallback(async () => {
    try {
      const response = await fetch(box.file.url);
      const csvData = await response.text();
      const { data } = Papa.parse(csvData);
      setData(data);
    } catch (error) {
      setErrorMessage(error);
    }
  }, [box.file.url]);

  useEffect(() => {
    fetchCSV();
  }, [fetchCSV]);

  const handleOnClose = () => {
    onClose();
  };

  return (
    <Dialog open onClose={handleOnClose} fullWidth>
      {!data && (
        <Box sx={{ display: 'flex', height: '100px' }}>
          <Grid container alignItems="center" justifyContent="center">
            <CircularProgress />
          </Grid>
        </Box>
      )}
      {data && (
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {data.map((row) => {
                  if (row.length > 0) {
                    return (
                      <TableRow
                        key={row[0]}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        {row.map((column) => (
                          <TableCell>{column}</TableCell>
                        ))}
                      </TableRow>
                    );
                  } else {
                    return null;
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Dialog>
  );
};

export default PreviewBox;
