import React from 'react';

export const Pct = ({value, digits}) => (
  !isNaN(value)
  ? <span>
      {(100 * value).toFixed(digits || 0)}
      <span style={{fontSize: '75%', verticalAlign: 'middle'}}>%</span>
    </span>
  : null
);
export const Flt = ({value, digits}) => (
  !isNaN(value)
  ? <span>{value.toFixed(digits || 1)}</span>
  : null
);

// returns function for rendering the selected statistic
export const getStatRenderer = (stat, digitsPct = 0, digitsFlt = 1) => (
  !stat
  ? () => null
  : ['accuracy', 'precision', 'recall'].includes(stat)
  ? value => Pct({ value, digits: digitsPct })
  : value => Flt({ value, digits: digitsFlt })
);
