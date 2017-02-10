
const initialState = {
  status: false,
  files: {},
};

function combineStatus(files) {
  const values = Object.values(files).map(f => f.status);
  if (values.includes(false)) return false;
  if (values.length === 0 || values.includes(null)) return null;
  return true;
}
export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'FILE_LOADING':
    const files1 = { ...state.files, [action.payload.id]: {status: null, url: action.payload.url} };
    return { ...state, status: null, files: files1 };
  case 'FILE_LOADED':
    const files2 = { ...state.files, [action.payload.id]: {...state.files[action.payload.id], status: true} };
    return { ...state, status: combineStatus(files2), files: files2 };
  case 'FILE_FAILED':
    const files3 = { ...state.files, [action.payload.id]: {...state.files[action.payload.id], status: false} };
    return { ...state, status: false, files: files3 };
  default:
    return state;
  }
}

export default reducer;
