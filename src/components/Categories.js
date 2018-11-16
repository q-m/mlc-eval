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
    const { id, header, confusion, getClasses, href, sort, containerHeight, dispatch } = this.props;
    const stat = sort.key;
    const renderStat = getStatRenderer(stat);
    const { classes, getCount } = getClasses(confusion, sort, id);
    return (
      <Panel>
        <Panel.Heading>{header}</Panel.Heading>
        <ListGroup className='CategoryList' style={{maxHeight: containerHeight - 92}}>
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

function getClassesMain(confusion, sort, id) {
  const getCount = c => c.tp + c.fn;
  const classes = confusion.classes.slice().sort((a,b) => (sort.reverse ? -1 : 1) * (a[sort.key] - b[sort.key]));
  return { classes, getCount };
}
const MainCategoryList = connect(({ confusion, config: { sort }, windowSize: { height } }) => {
  return { confusion, getClasses: getClassesMain, sort, containerHeight: height };
})(_CategoryList);

function getClassesSecondary(confusion, sort, id) {
  const cls = confusion.classes.find(l => l.label === id) || {};
  const row = confusion.matrix[cls.idx] || [];
  const getCount = c => row[c.idx];
  const classes = confusion.classes.filter((c,i) => row[i] > 0).sort((a,b) => (-1 * (row[a.idx] - row[b.idx])));
  return { classes, getCount };
}
const SecondaryCategoryList = connect(({ labels, confusion, config: { sort }, windowSize: {height} }) => {
  return { labels, confusion, getClasses: getClassesSecondary, sort, containerHeight: height };
})(_CategoryList);

class Categories extends PureComponent {
  render() {
    const { sort, dispatch, match: { params: { ctrue, cpred } } } = this.props;
    return (
      <Row className='Categories'>
        <Col sm={6} md={3}>
          <MainCategoryList
            header={
              <div>
                <div className='pull-right'>
                  <DropdownButton id='sort' bsStyle='info' bsSize='xsmall' title={STAT_LABELS[sort.key]} pullRight>
                    {Object.keys(STAT_LABELS).map(stat => (
                      <MenuItem key={stat} onClick={() => dispatch(configSort(stat))}>{STAT_LABELS[stat]}</MenuItem>
                    ))}
                  </DropdownButton>
                </div>
                Actual
              </div>
            }
            href={(id) => `/categories/${id}`} />
        </Col>
        <Col sm={6} md={3}>
          {ctrue &&
            <SecondaryCategoryList id={parseInt(ctrue, 10)}
              header='Predicted'
              href={(id) => `/categories/${ctrue}/${id}`} />}
        </Col>
        <Col sm={12} md={6}>
          {ctrue && cpred &&
            <CategoryTokens ctrue={parseInt(ctrue, 10)} cpred={parseInt(cpred, 10)} />}
        </Col>
      </Row>
    );
  }
}

export default connect(
  ({ config: { sort }}) => ({ sort })
)(Categories);

class _CategoryTokens extends PureComponent {
  render() {
    const { containerHeight, features, ctrue, cpred } = this.props;
    const cat_tokens = (features.get(ctrue) || new Map()).get(cpred) || [];
    return (
      <Panel>
        <Panel.Heading>Training features</Panel.Heading>
        <ListGroup style={{maxHeight: containerHeight - 92}}>
          {cat_tokens.map((c,i) => (
            <ListGroupItem key={i}>
              {c[1]}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Panel>
    );
  }
}
const CategoryTokens = connect(
  ({ features, windowSize: { height } }) => ({ features, containerHeight: height })
)(_CategoryTokens);
