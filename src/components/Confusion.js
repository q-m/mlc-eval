import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'responsive-fixed-data-table'
import { Column, Cell } from 'fixed-data-table';
import './Confusion.css'

const MatrixCell = ({count, sum, self, ...props}) => {
  const cls = (
    !(count > 0) ? 'text-muted' :
    self ? 'bg-success' :
    count > sum*0.75 ? 'bg-danger' : 'bg-warning'
  );
  return (<Cell {...props} className={cls}>{count}</Cell>);
};

const _TitleCell = ({id, labels, dispatch, ...props}) => {
  const label = labels.get(id) || id;
  return (<Cell {...props} style={{textAlign: 'left'}}>{label}</Cell>);
};
const TitleCell = connect(
  ({ labels }) => ({ labels })
)(_TitleCell);

class Confusion extends Component {

  render() {
    const { confusion } = this.props;
    const header = confusion[0] ? confusion[0].slice(1, -1) : [];
    const rows = confusion.slice(1, -1);
    const sumrow = confusion.slice(-1)[0] || [];

    return (
      <div className='Confusion'>
        <Table
          rowHeight={30}
          headerHeight={30}
          footerHeight={30}
          rowsCount={rows.length}>
          <Column
            align='left'
            fixed={true}
            width={150}
            allowCellsRecycling={true}
            header={<Cell>▾ actual | predicted ▸</Cell>}
            cell={({rowIndex, ...props}) => (
              <TitleCell id={rows[rowIndex][0]} />
            )}
            footer={<Cell><b>Σ</b></Cell>}
            />
          {header.map((label, i) => (
            <Column
              align='center'
              key={label}
              width={35}
              allowCellsRecycling={true}
              header={<TitleCell id={label} />}
              cell={({rowIndex, ...props}) => (
                <MatrixCell {...props} count={rows[rowIndex][i + 1]} self={rowIndex === i} sum={rows[rowIndex].slice(-1)[0]} />
              )}
              footer={({...props}) => (
                <Cell {...props}>{sumrow[i + 1]}</Cell>
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
              <Cell {...props}>{rows[rowIndex].slice(-1)[0]}</Cell>
            )}
            footer={({...props}) => (
              <Cell {...props}>{sumrow.slice(-1)[0]}</Cell>
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
