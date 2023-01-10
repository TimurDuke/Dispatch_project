import {combineReducers} from "redux";
import usersSlice from "./slices/usersSlice";
import carriersSlice from "./slices/carriersSlice";
import tripsSlice from "./slices/tripsSlice";
import driversSlice from "./slices/driversSlice";
import brokersSlice from "./slices/brokersSlice";
import learningsSlice from "./slices/learningsSlice";

const rootReducer = combineReducers({
    users: usersSlice.reducer,
    carriers: carriersSlice.reducer,
    trips: tripsSlice.reducer,
    drivers: driversSlice.reducer,
    brokers: brokersSlice.reducer,
    learnings: learningsSlice.reducer
});

export default rootReducer;