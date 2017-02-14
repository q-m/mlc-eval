import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Well, Row, Col, Panel, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './Summary.css'

const pct = x => ( isNaN(x) ? x : ((x * 100).toFixed(1) + '%'));

class ModelParams extends PureComponent {
  render() {
    const { model } = this.props;
    let rows = [];
    model.forEach((value, key) => {
      if (key === 'label' || key === 'rho' || key === 'nr_sv') return; // skip that one, we want different thing
      rows.push(
        <tr key={key}>
          <th>{key}</th>
          <td><tt>{value}</tt></td>
        </tr>
      );
    });
    return (
      <Table className='ModelParams no-head'>
        <tbody>{rows}</tbody>
      </Table>
    );
  }
}

class CategoryStats extends PureComponent {
  render() {
    return (
      <Table className='CategoryStats no-head'>
        <tbody>
          <tr><th>Accuracy</th><td><tt>{ pct(this._getAccuracy()) || <Qm />}</tt></td></tr>
        </tbody>
      </Table>
    );
  }

  // @todo move to separate stats module e.g. using reselect
  _getAccuracy() {
    const { confusion } = this.props;
    if (!confusion[0]) return;
    const nItems = confusion.slice(-1)[0].slice(-1)[0];
    const nSuccess = confusion.slice(1, -1).reduce((r,row,i) => (
      r + row[i + 1]
    ), 0);
    return 1.0 * nSuccess / nItems;
  }
}

const Qm = ({dot}) => (<span className='spinning text-muted inline-block'>{dot ? '...' : '?'}</span>);

class Summary extends PureComponent {
  render() {
    const { confusion, labels, files, model } = this.props;
    const usedLabels = confusion[0] ? confusion[0].length - 2 : <Qm />;
    const totalLabels = labels.size;
    const nItems = confusion.length ? confusion.slice(-1)[0].slice(-1)[0] : <Qm />;
    return (
      <div className='Summary container'>
        <Well>
          <h2>Classification evaluation <small>summary</small></h2>
          <p>
            You have trained with <b>{nItems}</b> samples
            in <b>{usedLabels}</b> categories
            {totalLabels && <span> (out of <b>{totalLabels}</b> defined)</span>}.
          </p>
        </Well>
        <Row>
          <Col sm={4}>
            <Panel header={<h3>Model parameters</h3>}>
              {model.size > 0
                ? <ModelParams model={model} />
                : files.files.model
                ? <em className='text-muted'>Loading model <Qm dot /></em>
                : <em className='text-muted'>Please load a model.</em>}
              </Panel>
          </Col>
          <Col sm={4}>
            <Panel header={<h3>Statistics</h3>}>
              {confusion.length
                ? <CategoryStats confusion={confusion} />
                : files.files.confusion
                ? <em className='text-muted'>Loading confusion matrix <Qm dot /></em>
                : <em className='text-muted'>Please load a confusion matrix.</em>}
              </Panel>
            </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ model, confusion, labels, files }) => ({ model, confusion, labels, files })
)(Summary);
