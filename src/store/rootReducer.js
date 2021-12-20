import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import allChatsReducer from "./reducers/allChatsReducer";

export default combineReducers ({
    userReducer,
    allChatsReducer
})
