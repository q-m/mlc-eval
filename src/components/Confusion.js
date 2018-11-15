import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Column, Cell } from 'fixed-data-table-2';
import Table from './ResponsiveFixedDataTable';
import 'fixed-data-table-2/dist/fixed-data-table.css'
import './Confusion.css'

const MatrixCell = ({count, sum, self, ...props}) => {
  const cls = (
    !(count > 0) ? 'text-muted' :
    self ? 'bg-success' :
    count > sum*0.75 ? 'bg-danger' : 'bg-warning'
  );
  return (<Cell {...props} className={cls}>{count}</Cell>);
};

const _TitleCell = ({cls, labels, dispatch, ...props}) => {
  const label = labels.get(cls.label) || cls.label;
  return (<Cell {...props} style={{textAlign: 'left'}}>{label}</Cell>);
};
const TitleCell = connect(
  ({ labels }) => ({ labels })
)(_TitleCell);

class Confusion extends Component {

  render() {
    const { confusion: { count, matrix, classes } } = this.props;

    return (
      <div className='Confusion'>
        <Table
          rowHeight={30}
          headerHeight={30}
          footerHeight={30}
          rowsCount={classes.length}>
          <Column
            align='left'
            fixed={true}
            width={150}
            allowCellsRecycling={true}
            header={<Cell>▾ actual | predicted ▸</Cell>}
            cell={({rowIndex, ...props}) => (
              <TitleCell cls={classes[rowIndex]} />
            )}
            footer={<Cell><b>Σ</b></Cell>}
            />
          {classes.map((cls,i) => (
            <Column
              align='center'
              key={cls.label}
              width={35}
              allowCellsRecycling={true}
              header={<TitleCell cls={cls} />}
              cell={({rowIndex, ...props}) => (
                <MatrixCell {...props} count={matrix[rowIndex][i]} self={rowIndex === i} sum={cls.tp + cls.fn} />
              )}
              footer={({...props}) => (
                <Cell {...props}>{cls.tp + cls.fp}</Cell>
              )}
              />
          ))}
          <Column
            align='center'
            fixed={true}
            width={50}
            header={<Cell>Σ</Cell>}
            allowCellsRecycling={true}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>{classes[rowIndex].tp + classes[rowIndex].fn}</Cell>
            )}
            footer={({...props}) => (
              <Cell {...props}>{count}</Cell>
            )}
            />
          <Column width={15 /* to avoid scrollbar overlapping numbers */} />
        </Table>
      </div>
    );
  }
}

export default connect(
  ({ confusion }) => ({ confusion })
)(Confusion);
