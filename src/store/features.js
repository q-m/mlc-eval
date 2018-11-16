
export function load(url) {
  return (dispatch) => {
    dispatch({type: 'FILE_LOADING', payload: {id: 'features', url}});
    fetch(url)
      .then(response => response.text())
      .then(data => dispatch({type: 'FEATURES_LOAD', payload: data}))
      .then(data => dispatch({type: 'FILE_LOADED', payload: {id: 'features'}}))
      .catch(err => console.log(err));
  };
}

/*
 * The state is a Map of a Map of a two-element Array containing the item id and feature data.
 * Visually, this would look like:
 *
 *     state: Map({
 *       // true class 1
 *       1: Map({
 *         // predicted class 2
 *         2: [
 *           [12, "foo bar"],  // item id 12 with features "foo bar"
 *           [15, "bar boo"],  // item id 15 with features "bar boo"
 *         ]
 *       })
 *     })
 */
const initialState = new Map();

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'FEATURES_LOAD':
    const newState = new Map();
    action.payload.trim().split("\n").forEach(l => {
      const parts = l.split(/\s+/);
      const id = parts[0];
      const a = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      if (!newState.has(a)) newState.set(a, new Map());
      const bmap = newState.get(a);
      if (!bmap.has(b)) bmap.set(b, new Array());
      bmap.get(b).push([id, parts.slice(3).join(' ')]);
    });
    return newState;
  default:
    return state;
  }
}

export default reducer;
