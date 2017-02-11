import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Well, Row, Col, Panel, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './Summary.css'

class ModelParams extends PureComponent {
  render() {
    const { model } = this.props;
    let rows = [];
    model.forEach((value, key) => {
      if (key === 'label') return; // skip that one, we want different thing
      rows.push(
        <tr key={key}>
          <th>{key}</th>
          <td><tt>{value}</tt></td>
        </tr>
      );
    });
    return (
      <Table className='ModelParams'>
        <tbody>{rows}</tbody>
      </Table>
    );
  }
}

const Qm = () => (<span className='spinning text-muted inline-block'>?</span>);

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
          {model.size > 0 ?
            <Col sm={4}>
              <Panel header={<h3>Model parameters</h3>}>
                <ModelParams model={model} />
              </Panel>
            </Col> : null}
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ model, confusion, labels, files }) => ({ model, confusion, labels, files })
)(Summary);
