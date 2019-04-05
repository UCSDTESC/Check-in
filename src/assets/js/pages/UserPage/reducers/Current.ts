import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { TESCUser } from '~/static/types';

type NullableTESCUser = TESCUser | null;

const initialState: NullableTESCUser = null;

const currentUser: Reducer<NullableTESCUser> = (state: NullableTESCUser = initialState, action) => {
  switch (action.type) {
  case ActionTypes.UPDATE_CURRENT_USER:
    return {...action.payload};
  default:
    return state;
  }
};

export default currentUser;
