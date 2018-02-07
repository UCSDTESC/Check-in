import * as ActionTypes from '../actions/types';

const initialState = {
  filtered: 0,
  applicants: []
};

const resumes = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.REPLACE_APPLICANTS:
    return {...state, applicants: [
      ...action.applicants
    ]};
  case ActionTypes.REPLACE_FILTERED:
    return {...state, filtered: action.filtered};
  default:
    return state;
  }
};

export default resumes;
