
export function load(url) {
  return (dispatch) => {
    dispatch({type: 'FILE_LOADING', payload: {file: 'labels'}});
    fetch(url)
      .then(response => response.text())
      .then(data => dispatch({type: 'LABELS_LOAD', payload: data}))
      .then(data => dispatch({type: 'FILE_LOADED', payload: {file: 'labels'}}))
      .catch(err => console.log(err));
  };
}

const initialState = new Map();

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'LABELS_LOAD':
    const newState = new Map();
    action.payload.trim().split("\n").forEach(l => {
      const i = l.indexOf(' ');
      const id = parseInt(l.slice(0, i + 1), 10);
      const name = l.slice(i + 1).trim();
      newState.set(id, name);
    });
    return newState;
  default:
    return state;
  }
}

export default reducer;
