import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {AppBar, Avatar, Button, Grid, IconButton, ListItemIcon, Menu, Stack, Toolbar, Typography} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {Link} from 'react-router-dom';
import {apiUrl, dropDownMenu} from "../../../config";
import defaultAvatar from "../../../assets/default-avatar.png";
import {logoutRequest} from '../../../store/actions/usersActions';
import MenuIcon from '@mui/icons-material/Menu';

const AppToolbar = ({burgerBtn}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let avatarImage = defaultAvatar;
    if (user.avatar) {
        avatarImage = apiUrl + '/' + user.avatar;
    }
    return (
        <AppBar
            position="fixed"
            sx={{
                // width: `calc(100% - ${DRAWER_WIDTH}px)`,
                // ml: `${DRAWER_WIDTH}px`,
                // mr: 3,
                // backgroundColor: `rgba(255, 255, 255, 0.5)`
                display: 'flex',
                flexDirection: 'row',
                margin: '0 0 0 100px',
                backgroundColor: `rgba(255, 255, 255, 0.5)`,
                justifyContent: 'space-between',
            }}
            color="transparent"
            elevation={0}
            open={open}
        >
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => burgerBtn()}
                edge="start"
                sx={{mr: 2, ml: 0, ...({display: {sm: 'block', md: 'none'}})}}
            >
                <MenuIcon/>
            </IconButton>
            <ToastContainer/>
            <Toolbar>
                <Grid container justifyContent="flex-end" alignItems="center">
                    <Grid item>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                sx={{padding: 0}}
                            >
                                <Stack direction="row" spacing={1} color="inherit">
                                    <Avatar alt={user.displayName} src={avatarImage}
                                            sx={{width: 32, height: 32, mr: 1}}/>
                                    <Typography variant="button" noWrap>
                                        Hello, {user.displayName}
                                    </Typography>
                                </Stack>
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                {
                                    dropDownMenu(user.role).map(item => (
                                        <MenuItem onClick={handleClose} component={Link} to={item.path} key={item.id}>
                                            <ListItemIcon>
                                                <PersonIcon fontSize="small"/>
                                            </ListItemIcon>
                                            {item.title}
                                        </MenuItem>
                                    ))
                                }

                                <MenuItem onClick={() => dispatch(logoutRequest())}>
                                    <ListItemIcon>
                                        <Logout fontSize="small"/>
                                    </ListItemIcon>
                                    Sign Out
                                </MenuItem>
                            </Menu>
                        </div>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;