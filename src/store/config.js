
export function sort(key, reverse = null) {
  return (dispatch) => {
    dispatch({ type: 'CONFIG_UPDATE_SORT', payload: { key, reverse } });
    // dispatch({ type: 'CONFUSION_SORT', payload: { key, reverse: !!reverse } });
  };
}

export function setItemUrlTemplate(itemUrlTemplate) {
  return (dispatch) => {
    dispatch({ type: 'CONFIG_UPDATE_KEYS', payload: { itemUrlTemplate } });
  }
}

const initialState = {
  itemUrlTemplate: null,
  sort: {
    key: 'recall',
    reverse: true,
  },
};

export function reducer(state = initialState, action) {
  const payload = action.payload;
  switch(action.type) {
  case 'CONFIG_UPDATE_SORT':
    const reverse = payload.reverse !== null ? payload.reverse
                      : (payload.key === state.sort.key) !== state.sort.reverse;
    return { ...state, sort: { ...payload, reverse } };
  case 'CONFIG_UPDATE_KEYS':
    return { ...state, ...payload };
  default:
    return state;
  }
}

export default reducer;
