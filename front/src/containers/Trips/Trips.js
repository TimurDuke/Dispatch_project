import React, {useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Box, Grid, Tab, Tabs} from "@mui/material";
import InnerContainer from "../../components/InnerContainer/InnerContainer";
import TableHeaderRow from "../../components/Table/TableHeader/TableHeaderRow";
import {useDispatch, useSelector} from "react-redux";
import {fetchTripsRequest} from "../../store/actions/tripsActions";
import TripTableBody from "../../components/Table/TableBody/TripTableBody";
import AddButton from "../../components/UI/AddButton/AddButton";
import NewTrip from "../../components/Modals/NewTrip";
import {fetchUsersRequest} from "../../store/actions/usersActions";
import TabPanel from "../../components/TabPanel/TabPanel";
import {Link} from "react-router-dom";
import {fetchDriversRequest} from "../../store/actions/driversActions";
import EditButton from "../../components/UI/EditButton/EditButton";

const headerTitles = [
  "Loading date", "Unloading date",
    "Load ID", "PU Location", "DEL Location",
    "MILES", "RATE", "RPM", "Driver",
    "Dispatch Team", "Dispatch"
];

const Trips = ({history}) => {
  const dispatch = useDispatch();
  const trips = useSelector(state => state.trips.trips);

  useEffect(() => {
    dispatch(fetchTripsRequest(history.location.search));
    dispatch(fetchUsersRequest());
    dispatch(fetchDriversRequest());
  }, [dispatch,history.location.search]);

  const [loads, setLoads] = useState([]);

  useEffect(() => {
    if (trips.length !== 0) {
      setLoads(trips.map(trip => ({
        ...trip,
        driverId: trip.driverId._id,
        dispatchId: trip.dispatchId._id
      })));
    }

  }, [trips]);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const drivers = useSelector(state => state.drivers.drivers);
  const users = useSelector(state => state.users.users);

  const selectorChangeHandler = (e, id) => {
    const {name, value} = e.target.value;

    if (loads.length !== 0) {
      setLoads(prevState => {
        return loads.map(load => {
          if (load._id === id) {
            return {...prevState, [name]: value}
          } else {
            return load;
          }
        })
      })
    }
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <NewTrip handleClose={handleClose} open={open}/>
      <Grid item sx={{paddingLeft: "15px"}}>
        <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
          Trips
        </Typography>
      </Grid>



      <InnerContainer>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Upcoming" component={Link} to='/trips?status=upcoming' {...a11yProps(0)} />
              <Tab label="In Transit"  component={Link} to='/trips?status=transit' {...a11yProps(1)} />
              <Tab label="History"  component={Link} to='/trips?status=finished' {...a11yProps(2)} />
            </Tabs>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            {value === 0 ? <AddButton click={() => setOpen(true)}/> : <div/>}
            <EditButton/>
          </Box>
          <TabPanel
            value={value}
            index={value}
            header={<TableHeaderRow headerCells={headerTitles}/>}
            body={
              <TripTableBody
                trips={loads}
                drivers={drivers}
                users={users}
                selectChange={selectorChangeHandler}
              />
            }
          >
          </TabPanel>
        </Box>
      </InnerContainer>
    </>
    );
};

export default Trips;