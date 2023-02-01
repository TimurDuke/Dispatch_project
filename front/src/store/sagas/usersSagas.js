import {put, takeEvery} from "redux-saga/effects";
import axiosApi from "../../axiosApi";
import {
    changeDispatcherFailure,
    changeDispatcherRequest,
    changeDispatcherSuccess, changeStatusFailure, changeStatusRequest, changeStatusSuccess,
    changeUserFailure,
    changeUserRequest,
    changeUserSuccess,
    createDispatcherFailure,
    createDispatcherRequest,
    createDispatcherSuccess, createUserCarrierFailure, createUserCarrierRequest, createUserCarrierSuccess,
    fetchUsersFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    loginFailure,
    loginRequest,
    loginSuccess,
    logoutRequest,
    logoutSuccess,
} from "../actions/usersActions";
import {historyPush, historyReplace} from "../actions/historyActions";
import {addNotification} from "../actions/notifierActions";

export function* loginUserSaga({payload: userData}) {
    try {
        const response = yield axiosApi.post('/users/sessions', userData);
        yield put(loginSuccess(response.data));
        yield put(addNotification({message: 'Successfully log in!', variant: 'success'}));
        if (response.data.role !== 'carrier') {
            yield put(historyReplace('/loads?status=upcoming'));
        } else {
            yield put(historyReplace('/carrier-loads'));
        }
    } catch (e) {
        yield put(loginFailure(e.response && e.response.data));
    }
}

export function* logoutUserSaga() {
    try {
        yield put(logoutSuccess());
        yield axiosApi.delete('/users/sessions');
        yield put(historyPush('/login'));
    } catch (e) {
    }
}

export function* fetchUsers() {
    try {
        const response = yield axiosApi('/users');
        yield put(fetchUsersSuccess(response.data));
    } catch (e) {
        yield put(fetchUsersFailure(e.response.data));
    }
}

export function* changeUserData({payload: userData}) {
    try {
        const response = yield axiosApi.put('/users', userData);
        yield put(changeUserSuccess(response.data));
        yield put(addNotification({message: 'Successfully changed!', variant: 'success'}));

    } catch (e) {
        yield put(addNotification({message: 'Changing failed!', variant: 'error'}))
        yield put(changeUserFailure(e.response.data));
    }
}

export function* changeDispatcherData({payload: dispatcherData}) {
    try {
        yield axiosApi.put('/users/change_dispatcher', dispatcherData);
        yield put(changeDispatcherSuccess());
        yield put(addNotification({message: 'Successfully changed!', variant: 'success'}));
        const response = yield axiosApi('/users');
        yield put(fetchUsersSuccess(response.data));
    } catch (e) {
        yield put(addNotification({message: 'Changing failed!', variant: 'error'}));
        yield put(changeDispatcherFailure(e.response.data));
    }
}

export function* createDispatcher({payload: dispatcherData}) {
    try {
        yield axiosApi.post('/users', dispatcherData);
        yield put(createDispatcherSuccess());
        yield put(addNotification({message: 'Successfully created!', variant: 'success'}));
        const response = yield axiosApi('/users');
        yield put(fetchUsersSuccess(response.data));
    } catch (e) {
        yield put(addNotification({message: 'Creating failed!', variant: 'error'}));
        yield put(createDispatcherFailure(e.response.data));
    }
}

export function* changeStatus({payload: dispatcherData}) {
    try {
        yield axiosApi.put(`/users/?isWorking=${dispatcherData.isWorking}`, dispatcherData);
        yield put(changeStatusSuccess());
        yield put(addNotification({message: 'Status successfully changed!', variant: 'success'}));
        const response = yield axiosApi('/users');
        yield put(fetchUsersSuccess(response.data));
    } catch (e) {
        yield put(addNotification({message: 'Status changing failed!', variant: 'error'}));
        yield put(changeStatusFailure(e.response.data));
    }
}

export function* createUserCarrier({payload: userCarrierData}) {
    try {
        yield axiosApi.post('/users/user-carrier', userCarrierData);
        yield put(createUserCarrierSuccess());
        yield put(addNotification({message: 'Successfully created!', variant: 'success'}));
        const response = yield axiosApi('/users');
        yield put(fetchUsersSuccess(response.data));
    } catch (e) {
        yield put(addNotification({message: 'Creating failed!', variant: 'error'}));
        yield put(createUserCarrierFailure(e.response.data));
    }
}

const userSagas = [
    takeEvery(loginRequest, loginUserSaga),
    takeEvery(logoutRequest, logoutUserSaga),
    takeEvery(fetchUsersRequest, fetchUsers),
    takeEvery(changeUserRequest, changeUserData),
    takeEvery(changeDispatcherRequest, changeDispatcherData),
    takeEvery(createDispatcherRequest, createDispatcher),
    takeEvery(changeStatusRequest, changeStatus),
    takeEvery(createUserCarrierRequest, createUserCarrier),
];

export default userSagas;