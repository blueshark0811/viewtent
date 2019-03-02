import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  INTERVIEW_SUBMITTED,
  ASYNC_START,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:
      return {
        ...state,
        INTERVIEWSlug: action.payload ? action.payload.INTERVIEW.slug : '',
        title: action.payload ? action.payload.INTERVIEW.title : '',
        description: action.payload ? action.payload.INTERVIEW.description : '',
        body: action.payload ? action.payload.INTERVIEW.body : '',
        tagInput: '',
        tagList: action.payload ? action.payload.INTERVIEW.tagList : []
      };
    case EDITOR_PAGE_UNLOADED:
      return {};
    case INTERVIEW_SUBMITTED:
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload.errors : null
      };
    case ASYNC_START:
      if (action.subtype === INTERVIEW_SUBMITTED) {
        return { ...state, inProgress: true };
      }
      break;
    case ADD_TAG:
      return {
        ...state,
        tagList: state.tagList.concat([state.tagInput]),
        tagInput: ''
      };
    case REMOVE_TAG:
      return {
        ...state,
        tagList: state.tagList.filter(tag => tag !== action.tag)
      };
    default:
      return state;
  }

  return state;
};
