import * as ActionTypes from '../actions/types';

const initialState = {
	events: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.LOAD_USER_EVENTS:
			return {...action.events};
		default:
			return state;
  }
};
