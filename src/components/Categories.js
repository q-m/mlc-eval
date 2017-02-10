import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Badge, Row, Col, ListGroup, ListGroupItem, Panel } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './Categories.css'

class _CategoryItem extends PureComponent {
  render() {
    const { id, labels } = this.props;
    return (
      <div>
        {labels.get(id) || id}
        <Badge>{this._getCount()}</Badge>
      </div>
    );
  }

  _getCount() {
    const { id, scope, confusion } = this.props;
    if (scope) {
      const row = confusion.find(r => r[0] === scope) || [];
      const idx = (confusion[0] || []).findIndex(i => i === id);
      return row[idx];
    } else {
      const row = confusion.find(r => r[0] === id) || [];
      return row[row.length - 1];
    }
  }
}
const CategoryItem = connect(({ labels, confusion }) => {
  return { labels, confusion };
})(_CategoryItem);

class _CategoryList extends PureComponent {
  render() {
    const { id, header, categories, href, containerHeight, dispatch } = this.props;
    return (
      <Panel header={header}>
        <ListGroup className='CategoryList' style={{maxHeight: containerHeight - 92}} fill>
          {categories.map(cid => (
            <LinkContainer key={cid} to={href(cid)}>
              <ListGroupItem bsStyle={id ? (id === cid ? 'success' : 'warning') : null}>
                <CategoryItem id={cid} scope={id} />
              </ListGroupItem>
            </LinkContainer>
          ))}
        </ListGroup>
      </Panel>
    );
  }
}
// @todo move gathering data somewhere else, so that link state change doesn't trigger it
const MainCategoryList = connect(({ confusion, windowSize: { height } }) => {
  const categories = confusion.slice(1, -1).map(r => r[0]);
  return { categories, containerHeight: height };
})(_CategoryList);

const SecondaryCategoryList = connect(({ labels, confusion, windowSize: { height } }, { id }) => {
  const row = confusion.find(r => r[0] === id) || [];
  const categories = (confusion[0]||[]).slice(1, -1).filter((c,i) => row[i+1] > 0);
  return { categories, containerHeight: height };
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
