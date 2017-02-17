import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Well, Row, Col, Panel, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { STAT_LABELS } from '../store/confusion'
import { getStatRenderer } from './Stat'
import './Summary.css'

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
    const { stats: { micro, macro } } = this.props;
    return (
      <Table className='CategoryStats no-head'>
        <tbody>
          {Object.keys(STAT_LABELS).map(stat => (
            <tr key={stat}>
              <th>{STAT_LABELS[stat]}</th>
              <td>{getStatRenderer(stat, 1, 2)(micro[stat])}</td>
              <td>{getStatRenderer(stat, 1, 2)(macro[stat])}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td></td><th>micro avg.</th><th>macro avg.</th></tr>
        </tfoot>
      </Table>
    );
  }
}

const Qm = ({dot}) => (<span className='spinning text-muted inline-block'>{dot ? '...' : '?'}</span>);

class Summary extends PureComponent {
  render() {
    const { confusion, labels, files, model } = this.props;
    const usedLabels = confusion.classes.length;
    const totalLabels = labels.size;
    return (
      <div className='Summary container'>
        <Well>
          <h2>Classification evaluation <small>summary</small></h2>
          <p>
            You have trained with <b>{confusion.count || <Qm />}</b> samples
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
              {confusion.count
                ? <CategoryStats stats={confusion.stats} />
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
