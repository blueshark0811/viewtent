import interview from './reducers/interview';
import interviewList from './reducers/interviewList';
import auth from './reducers/auth';
import { combineReducers } from 'redux';
import common from './reducers/common';
import editor from './reducers/editor';
import invite from './reducers/invite';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  interview,
  interviewList,
  auth,
  common,
  editor,
  home,
  profile,
  invite,
  settings,
  router: routerReducer
});
