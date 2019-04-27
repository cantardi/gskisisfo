import React, { Component } from 'react';
import {
  Nav,
  Navbar,
  NavItem,
  NavDropdown
} from 'react-bootstrap';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Calendar from "./components/Calendar";
import Communication from "./components/Communication";
import Home from "./components/Home";
import Administration from "./components/Administration";
import AccountSetup from "./components/AccountSetup";
import SignOut from "./components/SignOut";
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className=''>

        <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"/>

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand>
            <NavLink className="nav-link" to="/">GSKI Rehuel</NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavLink className="nav-link" to="/Calendar">Calendar</NavLink>
              <NavLink className="nav-link" to="/Communication">Communication</NavLink>
              <NavLink className="nav-link" to="/Administration">Administration</NavLink>
            </Nav>
            <Nav>
              <NavLink className="nav-link" to="/Account">Account</NavLink>
              <NavLink className="nav-link" to="/SignOut">Sign Out</NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="content">
          <Route exact path="/" component={Home}/>
          <Route path="/Calendar" component={Calendar}/>
          <Route path="/Communication" component={Communication}/>
          <Route path="/Administration" component={Administration}/>
          <Route path="/AccountSetup" component={AccountSetup}/>
          <Route path="/SignOut" component={SignOut}/>
        </div>

      </div>

      </HashRouter>

      
    );
  }
}

export default App;
