import React, {useEffect, useState} from 'react';
import InnerContainer from "../../components/InnerContainer/InnerContainer";
import Typography from "@mui/material/Typography";
import {Grid, InputBase, styled} from "@mui/material";
import NewDispatcher from "../../components/Modals/DispatcherModal/NewDispatcher";
import useTableSearch from "../../components/UI/Filter/useTableSearch/useTableSearch";
import {useDispatch, useSelector} from "react-redux";
import {changeStatusRequest, fetchUsersRequest} from "../../store/actions/usersActions";
import SearchIcon from "@mui/icons-material/Search";
import TableHeaderRow from "../../components/Table/TableHeader/TableHeaderRow";
import DispatcherTableBody from "../../components/Table/TableBody/DispatcherTableBody";
import InnerTable from "../../components/Table/InnerTable";

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

const headerTitles = ["avatar", "email", "name", "phone", "status"];

const UserCarriers = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const [userCarriers, setUserCarriers] = useState([]);
  const [searchVal, setSearchVal] = useState(null);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  const { filteredData } = useTableSearch({
    searchVal,
    data: userCarriers
  });

  useEffect(() => {
    if (users.length !== null) {

      setUserCarriers(() => (
        users.filter(user => user.role === "carrier")
      ));
    }
  }, [users, filteredData]);

  const activeSwitcherHandler = async (e) => {

    const copyUserCarrier = userCarriers.map(dispatcher => {
      if (dispatcher._id === e.target.id) {
        return {
          ...dispatcher,
          isWorking: e.target.checked
        }
      } else {
        return dispatcher;
      }
    });

    const userCarrier = copyUserCarrier.find(carrier => carrier._id === e.target.id);
    await dispatch(changeStatusRequest(userCarrier));
  };



  return (
    <InnerContainer>
      <Grid item sx={{paddingLeft: "15px"}}>
        <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
          Carriers
        </Typography>
      </Grid>

      <Grid
        item
        container
        spacing={2}
        justifyContent="space-between"
      >
        <Grid
          item
          padding="15px"
        >
          <NewDispatcher dispatcherRole="carrier" title="New Carrier User"/>
        </Grid>

        <Grid item>
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
        header={
          <TableHeaderRow
            headerCells={headerTitles}
            data={false}
            sx={{fontSize: "16px", fontWeight: "bold", textTransform: "uppercase"}}
          />
        }
        body={
          <DispatcherTableBody dispatchers={filteredData} switchHandler={activeSwitcherHandler}/>
        }
      />
      
    </InnerContainer>
  );
};

export default UserCarriers;