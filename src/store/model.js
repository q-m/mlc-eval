
// we're only interested in the model header, the rest may be too large to use
export function load(url) {
  return (dispatch) => {
    dispatch({type: 'FILE_LOADING', payload: {id: 'model', url}});
    fetch(url, {headers: {'Range': 'bytes=0-1000000'}})
      .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let data = '';
        return reader.read().then(function processResult(result) {
          if (result.done) return;
          data += decoder.decode(result.value, {stream: true});
          // only keep the part before 'w' on a line by itself
          const idx = data.indexOf('\nw\n');
          if (idx >= 0) {
            reader.cancel();
            return data.slice(0, idx);
          }
          // next chunk
          return reader.read().then(processResult);
        });
      })
      .then(data => dispatch({type: 'MODEL_LOAD', payload: data}))
      .then(data => dispatch({type: 'FILE_LOADED', payload: {id: 'model'}}))
      .catch(err => console.log(err));
  };
}

const initialState = new Map();

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'MODEL_LOAD':
    const newState = new Map();
    action.payload.trim().split("\n").forEach(l => {
      const i = l.indexOf(' ');
      const key = l.slice(0, i);
      let value = l.slice(i + 1);
      if (value) {
        if (key === 'label') value = value.split().map(s => parseInt(s, 10));
        newState.set(key, value);
      }
    });
    return newState;
  default:
    return state;
  }
}

export default reducer;
