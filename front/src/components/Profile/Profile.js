import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid
} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormElement from "../UI/Form/FormElement/FormElement";
import {apiUrl} from "../../config";
import FileInput from "../UI/Form/FileInput/FileInput";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import {changeUserRequest} from "../../store/actions/usersActions";
import PasswordInput from "../UI/Form/PasswordInput/PasswordInput";
import defaultAvatar from "../../assets/default-avatar.png";

const Profile = ({user, error}) => {
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState({
    email: "",
    oldPassword: "",
    password: "",
    displayName: "",
    avatar: ""
  });

  const [currentAvatar, setCurrentAvatar] = useState({
    avatarImg: ""
  });

  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  useEffect(() => {
    setUserProfile({
      email: user.email,
      oldPassword: "",
      password: "",
      displayName: user.displayName,
      avatar: user.avatar
    });

    if(user.avatar) {
      setCurrentAvatar({
        avatarImg: apiUrl + "/" + user.avatar,
      });
    } else {
      setCurrentAvatar({
        avatarImg: defaultAvatar,
      });
    }

  }, [user]);

  const inputChangeHandler = e => {
    const {name, value} = e.target;
    setUserProfile(prev => ({...prev, [name]: value}));
  };

  const fileChangeHandler = e => {
    const name = e.target.name;
    const file = e.target.files[0];

    setUserProfile(prev => ({...prev, [name]: file}));
    setCurrentAvatar({
      avatarImg: URL.createObjectURL(e.target.files[0]),
    });
  };

  const getFieldError = fieldName => {
    try {
      return error.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const submitFormHandler = async e => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(userProfile).forEach(key => {
      formData.append(key, userProfile[key]);
    });

    await dispatch(changeUserRequest(formData));
    setChangePassword(false);
    setShowPassword(false);
    setShowOldPassword(false);
  };

  return (
    <Grid
      item
      container
      direction="column"
      component="form"
      onSubmit={submitFormHandler}
    >
      <Card sx={{ display: 'flex', backgroundColor: "#f0f2fe", flexDirection: "column", marginBottom: "15px" }}>
        <Box sx={{
          display: 'flex',
          alignItems: "center",
          flexDirection: {xs: "column", md: "row"},
        }}>
          <Box sx={{ display: 'flex',
            flexDirection: 'column',
            paddingLeft: "15px",
            paddingRight: "15px",
            alignItems: "center",
            borderRight: "1px rgba(0, 1, 0, 0.2) solid"
          }}>
            <CardMedia
              component="img"
              sx={{ width: 151, borderRadius: "50%", marginBottom: "15px" }}
              image={currentAvatar.avatarImg}
              alt="avatar"
            />

            <FileInput
              onChange={fileChangeHandler}
              label="Avatar"
              name="avatar"
              accept={'.png, .jpg, .jpeg, .gif'}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: {md: "20px"} }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Grid
                container
                alignItems="center"
                sx={{paddingBottom: "10px", width: "400px"}}
              >
                <Grid item sx={{width: "20%"}}>
                  <Typography>Email:</Typography>
                </Grid>

                <Grid item sx={{marginLeft: "15px", backgroundColor: "white"}}>
                  <FormElement
                    disabled={true}
                    type={'email'}
                    name={'email'}
                    label={'Email'}
                    value={userProfile.email}
                    required={true}
                    onChange={inputChangeHandler}
                    error={getFieldError('email')}
                  />
                </Grid>
              </Grid>

              <Grid
                item
                container
                alignItems="center"
                sx={{paddingBottom: "10px", width: "400px"}}
              >
                <Grid item sx={{width: "20%"}}>
                  <Typography>Name:</Typography>
                </Grid>

                <Grid item sx={{marginLeft: "15px", backgroundColor: "white"}}>
                  <FormElement
                    type={'text'}
                    name={'displayName'}
                    label={'Name'}
                    value={userProfile.displayName}
                    required={true}
                    onChange={inputChangeHandler}
                    error={getFieldError('displayName')}
                  />
                </Grid>
              </Grid>

                <Grid item sx={{marginTop: "25px"}}>
                  <Button
                    variant="contained"
                    onClick={() => setChangePassword(!changePassword)}
                  >
                    Change Password
                  </Button>
                </Grid>

              {changePassword === true &&
                <>
                  <Grid item sx={{marginTop: "10px", backgroundColor: "white"}}>
                    <PasswordInput
                      id="old_password"
                      label="Old password"
                      name="oldPassword"
                      value={userProfile.oldPassword}
                      show={showOldPassword}
                      showHandler={() => setShowOldPassword(!showOldPassword)}
                      inputHandler={inputChangeHandler}
                      getError={getFieldError("oldPassword")}
                    />
                  </Grid>

                  <Grid item sx={{marginTop: "10px", backgroundColor: "white"}}>
                    <PasswordInput
                      id="new_password"
                      label="New password"
                      name="password"
                      value={userProfile.password}
                      show={showPassword}
                      showHandler={() => setShowPassword(!showPassword)}
                      inputHandler={inputChangeHandler}
                      getError={getFieldError("password")}
                    />
                  </Grid>
                </>
              }

            </CardContent>
          </Box>
        </Box>

        <Box sx={{marginY: "15px", marginLeft: "15px"}}>

          <ButtonWithProgress
            type="submit"
            variant="contained"
          >
            Save profile data
          </ButtonWithProgress>
        </Box>



      </Card>
    </Grid>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;