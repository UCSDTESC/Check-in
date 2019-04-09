// Remove when https://github.com/reduxjs/redux-thunk/pull/224 is released.
// Taken from https://github.com/reduxjs/redux-thunk/issues/213#issuecomment-473515144
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
declare module 'redux' {
  function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
    actionCreators: M,
    dispatch: Dispatch
  ): {
    [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
      ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
      : M[N]
  };
}
