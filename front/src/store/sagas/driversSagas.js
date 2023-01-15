import {put, takeEvery} from "redux-saga/effects";
import axiosApi from "../../axiosApi";
import {
  addDriverFailure,
  addDriverRequest,
  addDriverSuccess,
  fetchDriversFailure,
  fetchDriversRequest,
  fetchDriversSuccess,
  fetchDriverFailure,
  fetchDriverRequest,
  fetchDriversByCarrierFailure,
  fetchDriversByCarrierRequest,
  fetchDriversByCarrierSuccess,
  fetchDriverSuccess,
  updateDriverFailure,
  updateDriverRequest,
  updateDriverSuccess,
} from "../actions/driversActions";
import {addNotification} from "../actions/notifierActions";

export function* getDrivers(action) {
  try {
    let response;
    if (!action.payload || action.payload.carrier.length === 0 && action.payload.status === 'Status') {
      response = yield axiosApi('/drivers');
    } else {
      response = yield axiosApi('/drivers/?status=' + action.payload.status, {params: {carrier: action.payload.carrier}});
    }
    yield put(fetchDriversSuccess(response.data));
  } catch (e) {
    yield put(fetchDriversFailure(e.response && e.response.data));
  }
}

export function* fetchDriversByCarrier() {
  try {
    const response = yield axiosApi('/drivers/carrier');
    yield put(fetchDriversByCarrierSuccess(response.data));
  } catch (e) {
    yield put(fetchDriversByCarrierFailure(e.response.data));
    yield put(addNotification({message: 'Drivers fetch failed!', variant: 'error'}));
  }
}

export function* fetchDriver({payload: id}) {
  try {
    const response = yield axiosApi('/drivers/' + id);
    yield put(fetchDriverSuccess(response.data));
  } catch (e) {
    yield put(fetchDriverFailure(e.response.data));
    yield put(addNotification({message: 'Driver fetch failed!', variant: 'error'}));
  }
}

export function* addDriver({payload}) {
  try {
    yield axiosApi.post('/drivers', payload.data);
    yield put(addDriverSuccess());
    if(payload.user.role === 'carrier') {
      yield put(fetchDriversByCarrierRequest());
    } else {
      yield put(fetchDriversRequest());
    }
    yield put(addNotification({message: 'You have successfully added a driver!', variant: 'success'}));
  } catch (e) {
    yield put(addDriverFailure(e.response && e.response.data));
    yield put(addNotification({message: 'Driver creation failed!', variant: 'error'}));
  }
}

export function* updateDriver({payload}) {
  try {
    yield axiosApi.put('/drivers/' + payload.id, payload.data);
    yield put(updateDriverSuccess());
    if(payload.user.role === 'carrier') {
      yield put(fetchDriversByCarrierRequest());
    } else {
      yield put(fetchDriversRequest());
    }
    yield put(addNotification({message: 'You have successfully updated a driver!', variant: 'success'}));
  } catch (e) {
    yield put(updateDriverFailure(e.response.data));
    yield put(addNotification({message: 'Driver update failed!', variant: 'error'}));
  }
}

const driversSaga = [
  takeEvery(fetchDriversRequest, getDrivers),
  takeEvery(fetchDriversByCarrierRequest, fetchDriversByCarrier),
  takeEvery(fetchDriverRequest, fetchDriver),
  takeEvery(addDriverRequest, addDriver),
  takeEvery(updateDriverRequest, updateDriver)
];

export default driversSaga;