import React, {useEffect, useMemo} from 'react';
import {List, ListItemButton, ListItemText, styled} from "@mui/material";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const StyledList = styled(List)(({theme}) => ({
    color: theme.palette.primary.main,
    '& .MuiListItemButton-root': {
        paddingLeft: 50,
    },
    '&& .Mui-selected, && .Mui-selected:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    '& .MuiListItemButton-root:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },
}));

let menu = [];

const DrawerContent = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.user);

    if (user.role === 'carrier') {
        menu = [
            {title: 'Drivers', route: '/drivers'},
            {title: 'My Trips', route: '/carrier-loads'},
        ]
    } else {
        menu = [
            {title:'Status Update', route:  '/status-update'},
            {title:'Trips', route:  '/loads/?status=upcoming'},
            {title: 'Carriers', route: '/carriers'},
            {title: 'Drivers', route: '/drivers'},
            {title: 'Brokers', route: '/brokers'},
            {title: 'Learnings', route: '/learnings'},
        ]
    }

    let menuItems = useMemo(() => menu, []);


    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useEffect(() => {
        const path = window.location.pathname;
        const index = menuItems.findIndex(text => text.route === path);
        setSelectedIndex(index);
    }, [dispatch, menuItems]);




    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    const listItem = (title, index, route) => (
      <ListItemButton key={title}
                      component={Link} to={route}
                      selected={selectedIndex === index}
                      onClick={() => handleListItemClick(index)}
      >
          <ListItemText primaryTypographyProps={{fontWeight: '700'}} primary={title}/>
      </ListItemButton>
    );

    return (
        <StyledList>
            {menuItems.map((text, index) => {
                if (text.title !== "Dispatchers") {
                    return listItem(text.title, index, text.route);
                } else {
                    if (user.role === "admin") {
                        return listItem(text.title, index, text.route);
                    } else {
                        return null;
                    }
                }
            })}
        </StyledList>
    );
};

export default DrawerContent;