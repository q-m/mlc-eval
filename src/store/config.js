
export function sort(key, reverse = true) {
  return (dispatch) => {
    dispatch({ type: 'CONFIG_UPDATE_SORT', payload: { key, reverse: !!reverse } });
    // dispatch({ type: 'CONFUSION_SORT', payload: { key, reverse: !!reverse } });
  };
}

const initialState = {
  sort: {
    key: 'recall',
    reverse: true,
  },
};

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'CONFIG_UPDATE_SORT':
    return { ...state, sort: { ...state.sort, ...action.payload } };
  default:
    return state;
  }
}

export default reducer;
