
export function sort(key, reverse = null) {
  return (dispatch) => {
    dispatch({ type: 'CONFIG_UPDATE_SORT', payload: { key, reverse } });
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
    const payload = action.payload;
    const reverse = payload.reverse !== null ? payload.reverse
                      : (payload.key === state.sort.key) !== state.sort.reverse;
    return { ...state, sort: { ...payload, reverse } };
  default:
    return state;
  }
}

export default reducer;
