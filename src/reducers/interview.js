import {
  INTERVIEW_PAGE_LOADED,
  INTERVIEW_PAGE_UNLOADED,
  ADD_QUESTION,
  DELETE_QUESTION,
  UPDATE_FIELD_EDITOR,
  APPLIER_PAGE_LOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case INTERVIEW_PAGE_LOADED:
      return {
        ...state,
        ...action.payload[0].interview,
        questions: action.payload[1].questions,
        appliers : action.payload[2].appliers
      };
    case INTERVIEW_PAGE_UNLOADED:
      return {};
    case ADD_QUESTION:
      return {
        ...state,
        questionErrors: action.error ? action.payload.errors : null,
        questions: action.error ?
          null :
          (state.questions || []).concat([action.payload.question])
      };
    case DELETE_QUESTION:
      const questionId = action.questionId
      return {
        ...state,
        questions: state.questions.filter(question => question.id !== questionId)
      };
    case UPDATE_FIELD_EDITOR:
      return { ...state, 
        [action.key]: action.value 
      };
    case APPLIER_PAGE_LOADED : 
      return {
        ...state,
        ...action.payload[0].interview,
        appliers : action.payload[1].appliers
      }
    default:
      return state;
  }
};
