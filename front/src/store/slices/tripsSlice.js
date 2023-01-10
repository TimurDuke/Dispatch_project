import {createSlice} from "@reduxjs/toolkit";

const name = 'trips';

export const initialState = {
  trips: [],
  trip: null,
  tripsByCarrier: [],
  loading: false,
  error: null,
  createTripError: null,
  editTripError: null
};

const tripsSlice = createSlice({
  name,
  initialState,
  reducers: {
    fetchTripsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTripsSuccess(state, {payload: trips}) {
      state.loading = false;
      state.trips = trips;
    },
    fetchTripsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchTripsByCarrierRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTripsByCarrierSuccess(state, {payload: tripsByCarrier}) {
      state.loading = false;
      state.tripsByCarrier = tripsByCarrier;
    },
    fetchTripsByCarrierFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    createTripRequest(state) {
      state.loading = true;
      state.createTripError = null;
    },
    createTripSuccess(state) {
      state.loading = false;
    },
    createTripFailure(state, action) {
      state.loading = false;
      state.createTripError = action.payload;
    },

    changeTripStatusRequest(state) {
      state.loading = true;
      state.error = null;
    },
    changeTripStatusSuccess(state) {
      state.loading = false;
    },
    changeTripStatusFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    cancelTripRequest(state) {
      state.loading = true;
      state.error = null;
    },
    cancelTripSuccess(state) {
      state.loading = false;
    },
    cancelTripFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchTripRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTripSuccess(state, {payload: trip}) {
      state.loading = false;
      state.trip = trip;
    },
    fetchTripFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    editTripRequest(state) {
      state.loading = true;
      state.editTripError = null;
    },
    editTripSuccess(state) {
      state.loading = false;
    },
    editTripFailure(state, action) {
      state.loading = false;
      state.editTripError = action.payload;
    },

    addCommentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addCommentSuccess(state) {
      state.loading = false;
    },
    addCommentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addAttachmentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addAttachmentSuccess(state) {
      state.loading = false;
    },
    addAttachmentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  
    confirmTripsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    confirmTripsSuccess(state) {
      state.loading = false;
    },
    confirmTripsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearCreateTripErrorRequest(state) {
      state.createTripError = null;
      state.editTripError = null;
      state.trip = null;
    },

    fetchWeekTripsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWeekTripsSuccess(state, {payload: trips}) {
      state.loading = false;
      state.trips = trips;
    },
    fetchWeekTripsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  }
});

export default tripsSlice;