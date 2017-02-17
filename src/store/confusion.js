
export function load(url) {
  return (dispatch) => {
    dispatch({type: 'FILE_LOADING', payload: {id: 'confusion', url}});
    fetch(url)
      .then(response => response.text())
      .then(data => dispatch({type: 'CONFUSION_LOAD', payload: data}))
      // .then(data => dispatch(sort('recall')))
      .then(data => dispatch({type: 'FILE_LOADED', payload: {id: 'confusion'}}))
      .catch(err => console.log(err));
  };
}

export function sort(key, reverse = true) {
  return {type: 'CONFUSION_SORT', payload: {key, reverse: !!reverse}};
}

const initialState = {
  count: null,      // number of items
  matrix: [],       // confusion matrix contents (without headers or sums)
  classes: [],      // class labels and stats in matrix order (x- and y-axis) (array of objects)
  stats: {
    micro: {},      // micro-averaged statistics for all classes
    macro: {},      // macro-averaged statistics for all classes
  },
};

export const STAT_LABELS = {
  recall:    'Recall',
  precision: 'Precision',
  accuracy:  'Accuracy',
  f1:        'F1-score',
  mcc:       'MCC-score',
};

// @see https://en.wikipedia.org/wiki/Confusion_matrix
// @see http://chrisalbon.com/machine-learning/precision_recall_and_F1_scores.html
function computeDerivedStats({ tp, fn, fp, tn }) {
    const accuracy  = 1.0 * (tp + tn) / (tp + fn + fp + tn);
    const precision = 1.0 * tp / (tp + fp) || 0;
    const recall    = 1.0 * tp / (tp + fn) || 0;
    const f1        = 2.0 * tp / (2 * tp + fp + fn);
    const mcc       = (tp * tn - fp * fn) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)) || 0;
    return { accuracy, precision, recall, f1, mcc };
}

function computeClassStats({ count, matrix, labels, actual, predicted }) {
  return labels.map((label, i) => {
    const p   = actual[i];          // positive observations
    const n   = count - p;          // negative observations
    const tp  = matrix[i][i];       // positive observations with positive predictions
    const fn  = p - tp;             // positive observations with negative predictions
    const fp  = predicted[i] - tp;  // negative observations with positive predictions
    const tn  = n - fp;             // negative observations with negative predictions
    return {
      idx: i, label,
      tp, fp, tn, fn,
      ...computeDerivedStats({ tp, fp, tn, fn })
    };
  });
}

// compute macro-averaged statistics
// @see http://rali.iro.umontreal.ca/rali/sites/default/files/publis/sokolovalapalme-jipm09.pdf
function computeMacroStats({ count, classes }) {
  const r = { accuracy: 0, precision: 0, recall: 0, f1: 0, mcc: 0 };
  classes.forEach(c => {
    Object.keys(r).forEach(stat => r[stat] += c[stat]);
  });
  Object.keys(r).forEach(stat => r[stat] /= classes.length);
  return r;
}

// compute micro-averaged statistics
function computeMicroStats({ count, classes }) {
  const s = { tp: 0, fn: 0, fp: 0, tn: 0};
  classes.forEach(c => {
    Object.keys(s).forEach(stat => s[stat] += c[stat]);
  });
  return { ...s, ...computeDerivedStats(s) };
}

export function reducer(state = initialState, action) {
  switch(action.type) {
  case 'CONFUSION_LOAD': {
    // read full matrix
    const fullMatrix = action.payload.trim().split("\n").map(l => l.split(' ').map(s => parseInt(s, 10)));
    // decompose into basic components
    const count = fullMatrix.slice(-1)[0].slice(-1)[0];
    const matrix = fullMatrix.slice(1, -1).map(a => a.slice(1, -1));
    const labels = fullMatrix[0].slice(1, -1);
    // compute statistics
    const actual = fullMatrix.slice(1, -1).map(a => a.slice(-1)[0]);
    const predicted = fullMatrix.slice(-1)[0].slice(1, -1);
    const classes = computeClassStats({ count, matrix, labels, actual, predicted });
    const macro = computeMacroStats({ count, classes });
    const micro = computeMicroStats({ count, classes });
    // we have everything now :)
    return { count, matrix, classes, stats: { micro, macro } };
  }
  /*
  case 'CONFUSION_SORT': {
    // @todo fix this, indices are mixed up somehow
    // first create sorted array with position and sort-value
    const { key, reverse } = action.payload;
    const sortmul = reverse ? -1 : 1;
    const mapping = state.classes.map((c,i) => ({ i, v: c[key] }));
    mapping.sort((a,b) => (a.v - b.v) * sortmul);
    // then sort labels and matrix
    const classes = mapping.map(m => ({ ...state.classes[m.i], idx: m.i }));
    const matrix = mapping.map(m => {
      const row = state.matrix[m.i];
      return mapping.map(n => row[n.i]);
    });
    return { ...state, matrix, classes };
  }
  */
  default:
    return state;
  }
}

export default reducer;
