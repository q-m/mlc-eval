import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Well } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './Summary.css'

const Qm = () => (<span className='spinning text-muted inline-block'>?</span>);

class Summary extends Component {
  render() {
    const { confusion, labels, files } = this.props;
    const usedLabels = confusion[0] ? confusion[0].length - 2 : <Qm />;
    const totalLabels = labels.size;
    const nItems = confusion.length ? confusion.slice(-1)[0].slice(-1)[0] : <Qm />;
    return (
      <div className='Summary container'>
        <Well>
          <h2>Machine-learning evaluation <small>summary</small></h2>
          <p>
            You have trained with <b>{nItems}</b> samples
            in <b>{usedLabels}</b> categories
            {totalLabels && <span> (out of <b>{totalLabels}</b> defined)</span>}.
          </p>
        </Well>
      </div>
    );
  }
}

export default connect(
  ({ confusion, labels, files }) => ({ confusion, labels, files })
)(Summary);
