import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Box, Grid, InputBase, styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import SearchIcon from '@mui/icons-material/Search';
import InnerContainer from "../../components/InnerContainer/InnerContainer";
import useTableSearch from '../../components/UI/Filter/useTableSearch/useTableSearch';
import {fetchLearningCategoriesRequest} from "../../store/actions/learningsActions";
import AddLearningCategory from "../../components/Modals/AddLearningCategory";

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

const CategoryStyle = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  '&:hover': {
    boxShadow: '4px 6px 8px -2px rgba(160, 174, 255, 0.5)',
    cursor: 'pointer',
  },
  margin: '7px 0',
  maxWidth: '550px',
  padding: theme.spacing(2),
}));

const Learnings = () => {
  const [searchVal, setSearchVal] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector(state => state.users.user);
  const categories = useSelector(state => state.learnings.categories);

  useEffect(() => {
    dispatch(fetchLearningCategoriesRequest());
  }, [dispatch]);

  const { filteredData} = useTableSearch({
    searchVal,
    data: categories
  });

  return (
    <>
      <InnerContainer>

        <Grid item sx={{paddingLeft: "15px"}}>
          <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
            Learnings
          </Typography>
        </Grid>
        <Grid
          item
          container
          spacing={2}
          justifyContent="space-between"
        >

          <Grid padding="15px">
            {user?.role === 'admin' &&
            <AddLearningCategory/>
            }
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

        <Box padding='0 30px'>
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" marginBottom={'10px'}>
            Categories
          </Typography>
          <Box height='65vh' sx={{overflowY: 'scroll'}}>
            {filteredData.map(cat => (
              <CategoryStyle key={cat._id}>
                <Typography>{cat.title}</Typography>
              </CategoryStyle>
            ))}
          </Box>

        </Box>

      </InnerContainer>

    </>
  );
};

export default Learnings;