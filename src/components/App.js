import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Glyphicon, MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import './App.css'

const FILE_DESC = {
  labels: 'Category labels',
  confusion: 'Confusion matrix',
  items: 'Training data',
  model: 'Model properties',
};

const FileIcon = ({ status }) => (
  status === true
    ? <Glyphicon glyph={'ok'} className='text-success' />
    : status === false
    ? <Glyphicon glyph={'remove'} className='text-danger' />
    : <Glyphicon glyph={'refresh'} className='text-muted spinning' />
);

class _FilesMenu extends Component {
  render() {
    const { files, title, dispatch, ...props } = this.props;
    return (
      <NavDropdown title={<span><FileIcon status={files.status} />{' '}{title}</span>} {...props}>
        {Object.keys(files.files).map(fileId => {
          const file = files.files[fileId];
          return (
            <MenuItem key={fileId} title={file.url}>
              <FileIcon status={file.status} />{' '}
              <span className='FileDesc'>{FILE_DESC[fileId] || <tt>{fileId}</tt>}</span>
              <span className='FileName'>{file.url && file.url.split('/').reverse()[0]}</span>
            </MenuItem>
          );
        })}
      </NavDropdown>
    );
  }
}

const FilesMenu = connect(
  ({ files }) => ({ files })
)(_FilesMenu);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar fluid inverse>
          <Navbar.Header>
            <Navbar.Brand>MLC-Eval</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <IndexLinkContainer to={'/'}><NavItem>Summary</NavItem></IndexLinkContainer>
              <LinkContainer to={'/categories'}><NavItem>Categories</NavItem></LinkContainer>
              <LinkContainer to={'/confusion-matrix'}><NavItem>Confusion Matrix</NavItem></LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavItem href='https://github.com/q-m/mlc-eval'>Help</NavItem>
              <FilesMenu title='Files' id='nav-files-menu' />
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {this.props.children}
      </div>
    );
  }
}

export default App;
