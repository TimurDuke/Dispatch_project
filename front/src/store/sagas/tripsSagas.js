import {put, takeEvery} from "redux-saga/effects";
import {
  addAttachmentFailure, addAttachmentRequest,
  addAttachmentSuccess,
  addCommentFailure,
  addCommentRequest, addCommentSuccess,
  cancelTripFailure, cancelTripRequest,
  cancelTripSuccess,
  changeTripStatusFailure, changeTripStatusRequest,
  changeTripStatusSuccess,
  createTripFailure, createTripRequest,
  createTripSuccess, editTripFailure, editTripRequest, editTripSuccess, fetchTripFailure, fetchTripRequest,
  fetchTripsFailure,
  fetchTripsRequest,
  fetchTripsSuccess, fetchTripSuccess
} from "../actions/tripsActions";
import {addNotification} from "../actions/notifierActions";
import axiosApi from "../../axiosApi";

export function* fetchTrips({payload: value}) {
  try{
    const response = yield axiosApi('/loads/' + value);
    yield put(fetchTripsSuccess(response.data));
  } catch (e) {
    yield put(fetchTripsFailure(e.response.error));
    yield put(addNotification({message: 'Trips fetch failed!', variant: 'error'}));
  }
}

export function* fetchTrip({payload: value}) {
  try{
    const response = yield axiosApi('/loads/' + value);
    yield put(fetchTripSuccess(response.data));
  } catch (e) {
    yield put(fetchTripFailure(e.response.error));
  }
}

export function* createTrip({payload: tripData}) {
  try {
    yield axiosApi.post('/loads', tripData);
    yield put(createTripSuccess());
    yield put(addNotification({message: 'Trip created!', variant: 'success'}));
    const response = yield axiosApi('/loads?status=upcoming');
    yield put(fetchTripsSuccess(response.data));
  } catch (e) {
    yield put(createTripFailure(e));
    yield put(addNotification({message: 'Trip creation failed!', variant: 'error'}));
  }
}

export function* editTrip({payload}) {
  try {
    yield axiosApi.put('/loads/' + payload.id, payload.tripData);
    yield put(editTripSuccess());
    yield put(addNotification({message: 'Trip edited!', variant: 'success'}));
    const response = yield axiosApi('/loads?status=' + payload.path);
    yield put(fetchTripsSuccess(response.data));
  } catch (e) {
    yield put(editTripFailure(e));
    console.log(e);
    yield put(addNotification({message: 'Trip edit failed!', variant: 'error'}));
  }
}

export function* addComment({payload}) {
  try {
    yield axiosApi.put('/loads/comment/' + payload.id, {comment:payload.comment});
    yield put(addCommentSuccess());
  } catch (e) {
    yield put(addCommentFailure(e));
  }
}

export function* addAttachment({payload}) {
  try {
    yield axiosApi.put('/loads/attachment/' + payload.id, payload.formData);
    yield put(addAttachmentSuccess());
  } catch (e) {
    yield put(addAttachmentFailure(e));
  }
}

export function* changeTripStatus({payload}) {
  try {
    yield axiosApi.put('/loads/status/' + payload.id);
    yield put(changeTripStatusSuccess());
    const response = yield axiosApi('/loads' + payload.path);
    yield put(fetchTripsSuccess(response.data));
  } catch (e) {
    yield put(changeTripStatusFailure(e));
  }
}

export function* cancelTrip({payload}) {
  try {
    yield axiosApi.put('/loads/cancel/' + payload.id);
    yield put(cancelTripSuccess());
    const response = yield axiosApi('/loads' + payload.path);
    yield put(fetchTripsSuccess(response.data));
  } catch (e) {
    yield put(cancelTripFailure(e));
  }
}

const tripsSagas = [
  takeEvery(fetchTripsRequest, fetchTrips),
  takeEvery(createTripRequest, createTrip),
  takeEvery(changeTripStatusRequest, changeTripStatus),
  takeEvery(cancelTripRequest, cancelTrip),
  takeEvery(fetchTripRequest, fetchTrip),
  takeEvery(editTripRequest, editTrip),
  takeEvery(addCommentRequest, addComment),
  takeEvery(addAttachmentRequest, addAttachment),
];

export default tripsSagas;