import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Badge, Row, Col, ListGroup, ListGroupItem, Panel } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './Categories.css'

class _CategoryItem extends PureComponent {
  render() {
    const { id, stat, count, labels } = this.props;
    return (
      <div>
        {labels.get(id) || id}
        <Badge style={{marginRight: '3.2em'}} className='alert-info'>{stat}</Badge>
        <Badge>{count}</Badge>
      </div>
    );
  }
}
const CategoryItem = connect(({ labels }) => {
  return { labels };
})(_CategoryItem);

const pct = f => (<span>{(100.0 * f).toFixed(0)}<span style={{fontSize: '60%', verticalAlign: 'middle'}}>%</span></span>);
const flt = f => (<span>{f.toFixed(1)}</span>);

// returns function for the statistics component, based on the selected statistic
const getStatRenderer = (stat) => (
  !stat
  ? () => null
  : ['accuracy', 'precision', 'recall'].includes(stat)
  ? cls => pct(cls[stat])
  : cls => flt(cls[stat])
);

class _CategoryList extends PureComponent {
  render() {
    const { id, header, classes, getCount, href, stat, containerHeight, dispatch } = this.props;
    const renderStat = getStatRenderer(stat);
    return (
      <Panel header={header}>
        <ListGroup className='CategoryList' style={{maxHeight: containerHeight - 92}} fill>
          {classes.map(c => (
            <LinkContainer key={c.label} to={href(c.label)}>
              <ListGroupItem bsStyle={id ? (id === c.label ? 'success' : 'warning') : null}>
                <CategoryItem id={c.label} count={getCount(c)} stat={renderStat(c)} scope={id} />
              </ListGroupItem>
            </LinkContainer>
          ))}
        </ListGroup>
      </Panel>
    );
  }
}
// @todo move gathering data somewhere else, so that link state change doesn't trigger it
const MainCategoryList = connect(({ confusion: { classes }, windowSize: { height } }) => {
  const getCount = c => c.tp + c.fn;
  return { classes, getCount, containerHeight: height, stat: 'recall' };
})(_CategoryList);

const SecondaryCategoryList = connect(({ labels, confusion, windowSize: { height } }) => {
  return { labels, confusion, containerHeight: height }
}, null, ({ labels, confusion, containerHeight }, dispatchProps, ownProps) => {
  const cls = confusion.classes.find(l => l.label === ownProps.id) || {};
  const row = confusion.matrix[cls.idx] || [];
  const getCount = c => row[c.idx];
  const classes = confusion.classes.filter((c,i) => row[i] > 0);
  classes.sort((a,b) => (-1 * (row[a.idx] - row[b.idx])));
  return { classes, getCount, containerHeight, ...dispatchProps, ...ownProps };
})(_CategoryList);

class Categories extends PureComponent {
  render() {
    const { dispatch, params: { ida, idb } } = this.props;
    return (
      <Row className='Categories'>
        <Col sm={6} md={3}>
          <MainCategoryList
            header='Actual'
            href={(id) => `/categories/${id}`} />
        </Col>
        <Col sm={6} md={3}>
          {ida
            ? <SecondaryCategoryList id={parseInt(ida, 10)}
                header='Predicted'
                href={(id) => `/categories/${ida}/${id}`} />
            : null}
        </Col>
        <Col sm={12} md={6}>

        </Col>
      </Row>
    );
  }
}

export default connect()(Categories);
