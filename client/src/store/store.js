import {createStore, combineReducers } from "redux";

import counter from './reducers/counter';
import profile from './reducers/profile';

const reducers = combineReducers({ counter, profile });

export default createStore(reducers);
