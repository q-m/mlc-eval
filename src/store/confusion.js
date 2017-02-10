
export function load(url) {
  return (dispatch) => {
    dispatch({type: 'FILE_LOADING', payload: {file: 'confusion'}});
    fetch(url)
      .then(response => response.text())
      .then(data => dispatch({type: 'CONFUSION_LOAD', payload: data}))
      .then(data => dispatch({type: 'FILE_LOADED', payload: {file: 'confusion'}}))
      .catch(err => console.log(err));
  };
}

const initialState = [];
// [
//   [  0, 1, 11, 14,  0 ],
//   [  1, 5,  0,  1,  7 ],
//   [ 11, 1, 17,  2, 20 ],
//   [ 14, 0,  5, 10, 15 ],
//   [  0, 6, 22, 13, 42 ],
// ];

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'CONFUSION_LOAD':
    return action.payload.trim().split("\n").map(l => l.split(' ').map(s => parseInt(s, 10)));
  default:
    return state;
  }
}

export default reducer;
