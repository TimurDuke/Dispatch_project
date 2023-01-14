import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchDriversRequest} from "../../store/actions/driversActions";
import {Grid, InputBase, styled, TableCell} from "@mui/material";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import InnerContainer from "../../components/InnerContainer/InnerContainer";
import useTableSearch from "../../components/UI/Filter/useTableSearch/useTableSearch";
import InnerTable from "../../components/Table/InnerTable";
import StatusUpdateTableBody from "../../components/Table/TableBody/StatusUpdateTableBody";
import {statusInterval} from "../../config";
import {fetchCarriersRequest} from "../../store/actions/carriersActions";
import FormSelect from "../../components/UI/Form/FormSelect/FormSelect";
import AutocompleteSelect from "../../components/UI/Form/Autocomplete/AutocompleteSelect";

const columns = [
    {key: 'companyId', label: 'Carrier', innerKey: 'title'},
    {key: 'name', label: 'Driver'},
    {key: 'status', label: 'Status'},
    {key: 'currentStatus', label: 'Current Status'},
    {key: 'pickUp', label: 'Pick Up'},
    {key: 'delivery', label: 'Delivery'},
    {key: 'ETA', label: 'ETA'},
    {key: 'readyTime', label: 'Ready Time'},
    {key: 'notes', label: 'Notes'},
    {key: 'phoneNumber', label: 'Phone Number'},
];

const statuses = ['Status','in transit', 'upcoming', 'ready', 'in tr/upc', 'off'];

const tableHeaderStyle = {fontSize: "12px", fontWeight: "bold"};

const SearchStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
  },
  marginRight: theme.spacing(6),
  marginLeft: 0,
  marginTop: '25px',
  width: '50%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '50%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



const StatusUpdate = () => {
  const dispatch = useDispatch();
  const drivers = useSelector(state => state.drivers.drivers);
  const carriers = useSelector(state => state.carriers.carriers);
  const [carrierSelector, setCarrierSelector] = useState(["Carriers"]);
  const [selectedCarrier, setSelectedCarrier] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Status");

  useEffect(() => {
    dispatch(fetchDriversRequest({
      carrier: [...selectedCarrier].map(item => item.id),
      status: selectedStatus}
    ));
    const interval = setInterval(() => {
      dispatch(fetchDriversRequest());
      }, statusInterval);
    return () => clearInterval(interval);
    }, [dispatch, selectedCarrier, selectedStatus]);

    useEffect(() => {
      dispatch(fetchCarriersRequest());
    }, [dispatch]);

    useEffect(() => {
      const carriersTitles = carriers.map(carrier => ({
        label: carrier.title,
        id: carrier._id
      }));
      setCarrierSelector(() => [...carriersTitles]);
    }, [carriers]);

    const selectCarrierHandler = (event, newValue) => {
      setSelectedCarrier([
        ...newValue]);
    };

    const selectedStatusHandler = event => {
      setSelectedStatus(event.target.value);
    };

    const tableHeader = (
      <>
        {carrierSelector.length !== null &&
          <>
            <TableCell sx={tableHeaderStyle}>
              <AutocompleteSelect
                options={carrierSelector}
                value={selectedCarrier}
                onChange={selectCarrierHandler}
                placeholder="Companies"
              />
            </TableCell>
            <TableCell sx={tableHeaderStyle}>Driver</TableCell>
            <TableCell sx={tableHeaderStyle}>
              <FormSelect
                label="Status"
                array={statuses}
                value={selectedStatus}
                onChange={selectedStatusHandler}
                required={true}
                variant="array"
                driver={false}
                def={selectedStatus}
              />
            </TableCell>
            <TableCell sx={tableHeaderStyle}>Current Status</TableCell>
            <TableCell sx={tableHeaderStyle}>PickUp</TableCell>
            <TableCell sx={tableHeaderStyle}>Delivery</TableCell>
            <TableCell sx={tableHeaderStyle}>ETA</TableCell>
            <TableCell sx={tableHeaderStyle}>Ready time</TableCell>
            <TableCell sx={tableHeaderStyle}>Notes</TableCell>
            <TableCell sx={tableHeaderStyle}>Phone number</TableCell>
          </>
        }
      </>
    );

    const [searchVal, setSearchVal] = useState(null);

    const { filteredData} = useTableSearch({
      searchVal,
      data: drivers
    });


    return (
      <InnerContainer>
        <Grid item sx={{paddingLeft: "15px"}}>
          <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
              Status Update
          </Typography>
        </Grid>
        <Grid item sx={{width: 350, marginLeft: 'auto', marginBottom: 3}}>
          <SearchStyle>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearchVal(e.target.value)}
            />
          </SearchStyle>
        </Grid>

        <InnerTable
          header={tableHeader}
          body={
            <StatusUpdateTableBody
              columns={columns}
              filteredData={filteredData}
            />
          }
        />
      </InnerContainer>
    );
};

export default StatusUpdate;