import React from 'react';
import {Box, Grid, IconButton, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";

const TabPanel = (props) => {
  const { children, value, index, header, body, history, goWeekBack, goWeekForward, week, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {history === "?status=finished" &&
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <IconButton onClick={goWeekBack}>
                  <ChevronLeft fontSize="large"/>
                </IconButton>
              </Grid>
              <Grid item>
                <Typography>{week}</Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={goWeekForward}>
                  <ChevronRight fontSize="large"/>
                </IconButton>
              </Grid>
            </Grid>
          }
          <TableContainer component={Paper} sx={{background: "#f0f2fe"}}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {header}
                </TableRow>
              </TableHead>
              <TableBody>
                {body}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
};

export default TabPanel;