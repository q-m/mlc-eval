import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Badge, Row, Col, DropdownButton, ListGroup, ListGroupItem, MenuItem, Panel } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { sort as configSort } from '../store/config'
import { STAT_LABELS } from '../store/confusion'
import { getStatRenderer } from './Stat'
import './Categories.css'

class _CategoryItem extends PureComponent {
  render() {
    const { id, stat, count, labels } = this.props;
    return (
      <div>
        {labels.get(id) || id}
        <Badge style={stat ? {marginRight: '3.5em'} :null}>{count}</Badge>
        <Badge className='alert-info'>{stat}</Badge>
      </div>
    );
  }
}
const CategoryItem = connect(({ labels }) => {
  return { labels };
})(_CategoryItem);

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
                <CategoryItem id={c.label} count={getCount(c)} stat={renderStat(c[stat])} scope={id} />
              </ListGroupItem>
            </LinkContainer>
          ))}
        </ListGroup>
      </Panel>
    );
  }
}
// @todo move gathering data somewhere else, so that link state change doesn't trigger it
const MainCategoryList = connect(({ confusion: { classes }, config: {sort: {key}}, windowSize: {height} }) => {
  const getCount = c => c.tp + c.fn;
  return { classes, getCount, stat: key, containerHeight: height };
})(_CategoryList);

const SecondaryCategoryList = connect(({ labels, confusion, windowSize: {height} }) => {
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
    const { sort, dispatch, params: { ida, idb } } = this.props;
    return (
      <Row className='Categories'>
        <Col sm={6} md={3}>
          <MainCategoryList
            header={
              <div>
                <div className='pull-right'>
                  <DropdownButton id='sort' bsStyle='info' bsSize='xsmall' title={STAT_LABELS[sort.key]} pullRight>
                    {Object.keys(STAT_LABELS).map(stat => (
                      <MenuItem key={stat} onClick={() => dispatch(configSort(stat, !sort.reverse))}>{STAT_LABELS[stat]}</MenuItem>
                    ))}
                  </DropdownButton>
                </div>
                Actual
              </div>
            }
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

export default connect(
  ({ config: { sort }}) => ({ sort })
)(Categories);
