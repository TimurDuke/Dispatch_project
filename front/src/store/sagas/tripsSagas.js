import {put, takeEvery} from "redux-saga/effects";
import {
  addAttachmentFailure,
  addAttachmentRequest,
  addAttachmentSuccess,
  addCommentFailure,
  addCommentRequest,
  addCommentSuccess,
  cancelTripFailure,
  cancelTripRequest,
  cancelTripSuccess,
  changeTripStatusFailure,
  changeTripStatusRequest,
  changeTripStatusSuccess,
  confirmTripsFailure, confirmTripsRequest,
  confirmTripsSuccess,
  createTripFailure,
  createTripRequest,
  createTripSuccess,
  editTripFailure,
  editTripRequest,
  editTripSuccess,
  fetchTripFailure,
  fetchTripRequest,
  fetchTripsByCarrierFailure,
  fetchTripsByCarrierRequest,
  fetchTripsByCarrierSuccess,
  fetchTripsFailure,
  fetchTripsRequest,
  fetchTripsSuccess,
  fetchTripSuccess, fetchWeekTripsFailure, fetchWeekTripsRequest, fetchWeekTripsSuccess
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

export function* fetchTripsByCarrier() {
  try{
    const response = yield axiosApi('/loads/carrier');
    yield put(fetchTripsByCarrierSuccess(response.data));
  } catch (e) {
    yield put(fetchTripsByCarrierFailure(e.response.error));
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
    yield put(createTripFailure(e.response && e.response.data));
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
    yield put(editTripFailure(e.response && e.response.data));
    yield put(addNotification({message: 'Trip edit failed!', variant: 'error'}));
  }
}

export function* addComment({payload}) {
  try {
    yield axiosApi.put('/loads/comment/' + payload.id, {comment:payload.comment});
    yield put(addCommentSuccess());
    yield put(addNotification({message: 'Comment added!', variant: 'success'}));
  } catch (e) {
    yield put(addCommentFailure(e));
    yield put(addNotification({message: 'Failed to add comment!', variant: 'error'}));
  }
}

export function* addAttachment({payload}) {
  try {
    yield axiosApi.put('/loads/attachment/' + payload.id, payload.formData);
    yield put(addAttachmentSuccess());
    yield put(addNotification({message: 'Attachment added!', variant: 'success'}));
  } catch (e) {
    yield put(addAttachmentFailure(e));
    yield put(addNotification({message: 'Failed to add attachment!', variant: 'error'}));
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
    yield put(addNotification({message: e.response.data.message, variant: 'error'}));
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


export function* confirmTrip({payload: id}) {
  try {
    yield axiosApi.put(`/loads/confirm/${id}`);
    yield put(confirmTripsSuccess());
    yield put(addNotification({message: 'Trip confirmed!', variant: 'success'}));
    const response = yield axiosApi('/loads?status=finished');
    yield put(fetchTripsSuccess(response.data));
  } catch (e) {
    yield put(confirmTripsFailure(e.response.data));
    yield put(addNotification({message: 'Trip confirming failed!', variant: 'error'}));
  }
}

export function* fetchWeekTrips({payload}) {
  try {
    const response = yield axiosApi('/loads/' + payload.value, {params: {...payload.week}});
    yield put(fetchWeekTripsSuccess(response.data));
  } catch (e) {
    yield put(fetchWeekTripsFailure(e.response.error))
    yield put(addNotification({message: 'Trips fetch failed!', variant: 'error'}));
  }
}

const tripsSagas = [
  takeEvery(fetchTripsRequest, fetchTrips),
  takeEvery(fetchTripsByCarrierRequest, fetchTripsByCarrier),
  takeEvery(createTripRequest, createTrip),
  takeEvery(changeTripStatusRequest, changeTripStatus),
  takeEvery(cancelTripRequest, cancelTrip),
  takeEvery(fetchTripRequest, fetchTrip),
  takeEvery(editTripRequest, editTrip),
  takeEvery(addCommentRequest, addComment),
  takeEvery(addAttachmentRequest, addAttachment),
  takeEvery(confirmTripsRequest, confirmTrip),
  takeEvery(fetchWeekTripsRequest, fetchWeekTrips)
];

export default tripsSagas;