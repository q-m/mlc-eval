import React, { Component } from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar fluid inverse>
          <Navbar.Header>
            <Navbar.Brand>ML-Eval</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to={'/categories'}><NavItem>Categories</NavItem></LinkContainer>
              <LinkContainer to={'/confusion-matrix'}><NavItem>Confusion Matrix</NavItem></LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavItem href='https://github.com/q-m/libsvm-evalui'>Github</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {this.props.children}
      </div>
    );
  }
}

export default App;
