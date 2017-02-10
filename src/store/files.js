
const initialState = {
  loaded: false,
  files: {},
};

function isLoaded(files) {
  const keys = Object.keys(files);
  return keys.length > 0 && keys.findIndex(k => !files[k]) === -1;
}

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'FILE_LOADING':
    const files1 = {...state.files, [action.payload.file]: false};
    return {...state, loaded: isLoaded(files1), files: files1 };
  case 'FILE_LOADED':
    const files2 = {...state.files, [action.payload.file]: true};
    return {...state, loaded: isLoaded(files2), files: files2 };
  default:
    return state;
  }
}

export default reducer;
