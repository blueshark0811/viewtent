import {
  INVITE_PAGE_LOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case INVITE_PAGE_LOADED: 
      return {
        ...state,
        ...action.payload.interview
      }
    default:
      return state;
  }
};
