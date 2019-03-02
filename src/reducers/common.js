import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  INTERVIEW_SUBMITTED,
  SETTINGS_SAVED,
  LOGIN,
  REGISTER,
  DELETE_INTERVIEW,
  INTERVIEW_PAGE_UNLOADED,
  EDITOR_PAGE_UNLOADED,
  HOME_PAGE_UNLOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ADD_APPLIER,
  AUTH_REQUIRED
} from '../constants/actionTypes';

const defaultState = {
  appName: 'viewtent',
  token: null,
  viewChangeCounter: 0
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null
      };
    case AUTH_REQUIRED:
      return { ...state, [action.key]: action.value };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: '/login', token: null, currentUser: null, goTo : null };
    case INTERVIEW_SUBMITTED:
      var redirectUrl = `/interview/${action.payload.interview.slug}`;
      return { ...state, redirectTo: redirectUrl };
    case ADD_APPLIER:
      // var redirectUrl = `/interview/${action.payload.applier.interview.slug}`;
      return { ...state, redirectTo: '/thankyou' };
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user
      };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : state.goTo? state.goTo : action.payload.user.companyname == '' || !action.payload.user.companyname ? '/login' : '/dashboard' ,
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user
      };
    case DELETE_INTERVIEW:
      return { ...state, redirectTo: '/' };
    case INTERVIEW_PAGE_UNLOADED:
    case EDITOR_PAGE_UNLOADED:
    case HOME_PAGE_UNLOADED:
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
};
