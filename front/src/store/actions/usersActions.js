import usersSlice from "../slices/usersSlice";

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFailure,
    changeUserRequest,
    changeUserSuccess,
    changeUserFailure,
    changeDispatcherRequest,
    changeDispatcherSuccess,
    changeDispatcherFailure,
    createDispatcherRequest,
    createDispatcherSuccess,
    createDispatcherFailure,
    changeStatusRequest,
    changeStatusSuccess,
    changeStatusFailure,
    createUserCarrierRequest,
    createUserCarrierSuccess,
    createUserCarrierFailure
} = usersSlice.actions