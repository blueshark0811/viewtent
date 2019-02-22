import {
  INTERVIEW_FAVORITED,
  INTERVIEW_UNFAVORITED,
  SET_PAGE,
  APPLY_TAG_FILTER,
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  CHANGE_TAB,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_LOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case INTERVIEW_FAVORITED:
    case INTERVIEW_UNFAVORITED:
      return {
        ...state,
        interviews: state.interviews.map(interview => {
          if (interview.slug === action.payload.interview.slug) {
            return {
              ...interview,
              favorited: action.payload.interview.favorited,
              favoritesCount: action.payload.interview.favoritesCount
            };
          }
          return interview;
        })
      };
    case SET_PAGE:
      return {
        ...state,
        interviews: action.payload.interviews,
        interviewsCount: action.payload.interviewsCount,
        currentPage: action.page
      };
    case APPLY_TAG_FILTER:
      return {
        ...state,
        pager: action.pager,
        interviews: action.payload.interviews,
        interviewsCount: action.payload.interviewsCount,
        tab: null,
        tag: action.tag,
        currentPage: 0
      };
    case HOME_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        interviews: action.payload[1].interviews,
        // interviewsCount: action.payload[1].interviewsCount,
        currentPage: 0,
        tab: action.tab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    case CHANGE_TAB:
      return {
        ...state,
        pager: action.pager,
        interviews: action.payload.interviews,
        interviewsCount: action.payload.interviewsCount,
        tab: action.tab,
        currentPage: 0,
        tag: null
      };
    case PROFILE_PAGE_LOADED:
    case PROFILE_FAVORITES_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        interviews: action.payload[1].interviews,
        interviewsCount: action.payload[1].interviewsCount,
        currentPage: 0
      };
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
