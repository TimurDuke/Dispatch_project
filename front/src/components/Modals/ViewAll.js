import React from 'react';
import {makeStyles} from "tss-react/mui";
import {Box, Button, Grid, Modal, TextField} from "@mui/material";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import {apiUrl} from "../../config";
import TripsComments from '../TripsComments/TripsComments';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: 600,
  overflow: "auto",
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '20px'
};

const useStyles = makeStyles()(theme => ({
  field: {
    background: "white",
    fontSize: "12px"
  },
  link: {
    color: "white",
    textDecoration: "none",
  }
}));


const ViewAll = ({open, handleClose, trip, user}) => {
  const {classes} = useStyles();

  return (
    trip && <div>
      <div>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >

          <Box sx={style}>
            <Typography variant={'h6'} mb={2}>
              View All
            </Typography>
            <Grid
              container
              direction="column"
            >

              <Grid
                container
                textAlign="center"
                spacing={1}
              >
                <Grid
                  item
                  container
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Grid item width="49.5%">
                    <TextField
                      name="datePU"
                      label="Loading date"
                      value={trip.datePU.substring(0, 10)}
                      className={classes.field}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item width="49.5%">
                    <TextField
                      name="dateDEL"
                      label="Arrival date"
                      value={trip.dateDEL.substring(0, 10)}
                      className={classes.field}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item width='100%'>
                    <TextField
                      name="loadCode"
                      label="Loading Code"
                      value={trip.loadCode}
                      className={classes.field}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item width="49.5%">
                      <TextField
                        name="pu"
                        label="Loading location"
                        value={trip.pu}
                        className={classes.field}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item width="49.5%">
                      <TextField
                        name="del"
                        label="Unloading location"
                        value={trip.del}
                        className={classes.field}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item width="49.5%">
                      <TextField
                        type="number"
                        name="miles"
                        label="Miles"
                        value={trip.miles}
                        className={classes.field}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item width="49.5%">
                      <TextField
                        type="number"
                        name="rpm"
                        label="Rate per mile"
                        value={trip.rpm}
                        className={classes.field}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item width="49.5%">
                      <TextField
                        label="Status"
                        name="status"
                        value={trip.status}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item width="49.5%">
                      <TextField
                        type="number"
                        name="price"
                        label="Price"
                        value={trip.price}
                        className={classes.field}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item width='100%'>
                    {trip.driverId &&
                      < TextField
                      label="Drivers"
                      name="driverId"
                      value={trip.driverId.name}
                      InputProps={{
                      readOnly: true,
                    }}
                      />
                    }
                  </Grid>

                  <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', margin: '12px 0 12px 10px'}}>
                    {trip && trip.RC
                      ? <ButtonWithProgress variant="contained" component="label">
                        <a href={apiUrl + '/' + trip.RC} target="_blank" rel="noreferrer" className={classes.link}>Download RC</a>
                      </ButtonWithProgress>
                      : null
                    }

                    {trip && trip.BOL
                      ? <ButtonWithProgress variant="contained" component="label">
                        <a href={apiUrl + '/' + trip.BOL} target="_blank" rel="noreferrer" className={classes.link}>Download BOL</a>
                      </ButtonWithProgress>
                      : null
                    }
                  </Box>
  
                  <div style={{margin: '16px 0 0 16px', width: '100%'}}>
                    <TripsComments commentArray={trip.comment} user={user}/>
                  </div>
                  
                  <Grid item xs={12} ml={'auto'}>
                    <Button fullWidth variant="contained" onClick={handleClose}>
                      Close
                    </Button>

                  </Grid>

                </Grid>

              </Grid>

            </Grid>

          </Box>



        </Modal>
      </div>

    </div>
  );
};

export default ViewAll;