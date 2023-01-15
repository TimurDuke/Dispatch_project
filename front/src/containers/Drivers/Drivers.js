import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, Typography} from '@mui/material';
import {fetchDriversByCarrierRequest, fetchDriversRequest} from '../../store/actions/driversActions';
import {fetchCarriersRequest} from "../../store/actions/carriersActions";
import AddDriver from "../../components/Modals/AddDriver";
import InnerTable from "../../components/Table/InnerTable";
import TableHeaderRow from "../../components/Table/TableHeader/TableHeaderRow";
import DriverTableBody from "../../components/Table/TableBody/DriverTableBody";
import InnerContainer from "../../components/InnerContainer/InnerContainer";
import SearchIcon from "@mui/icons-material/Search";
import {InputBase, styled} from "@mui/material";
import useTableSearch from "../../components/UI/Filter/useTableSearch/useTableSearch";


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

const columns = [
  {key: 'email', label: 'Email'},
  {key: 'name', label: 'Name'},
  {key: 'phoneNumber', label: 'Phone Number'},
  {key: 'companyId', label: 'Carriers', innerKey: 'title'},
  {key: 'description', label: 'Address', innerKey: 'address'},
  {key: 'description', label: 'DOB', innerKey: 'DOB'},
  {key: 'description', label: 'Info', innerKey: 'info'},
  {key: 'description', label: 'Reference', innerKey: 'reference'},
  {key: 'license', label: 'License'},
];

const Drivers = () => {
  const [searchVal, setSearchVal] = useState(null);

  const dispatch = useDispatch();
  const drivers = useSelector(state => state.drivers.drivers);
  const user = useSelector(state => state.users.user);

  useEffect(() => {
    if (user.role !== 'carrier') {
      dispatch(fetchDriversRequest());
      dispatch(fetchCarriersRequest());
    } else {
      dispatch(fetchDriversByCarrierRequest());
    }
  }, [dispatch, user.role]);



  const { filteredData} = useTableSearch({
    searchVal,
    data: drivers
  });


  return (
    <InnerContainer>
      <Grid item sx={{paddingLeft: "15px"}}>
        <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
          Drivers
        </Typography>
      </Grid>
      <Grid
        item
        container
        spacing={2}
        justifyContent="space-between"
      >
        <Grid padding="15px">
          <AddDriver/>
        </Grid>
        <Grid>
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
      </Grid>

      <InnerTable
        header={<TableHeaderRow headerCells={columns} data={true} sx={{fontSize: "12px", fontWeight: "bold"}}/>}
        body={
          <DriverTableBody
            columns={columns}
            filteredData={filteredData}
          />
        }
      />
    </InnerContainer>
  );
};

export default Drivers;