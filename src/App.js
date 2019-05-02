import React, { Component } from 'react';
import {
  Nav,
  Navbar
} from 'react-bootstrap';
import {
  Route,
  NavLink,
  BrowserRouter
} from "react-router-dom";
import Home from "./components/Home";
import Calendar from "./components/Calendar";
import SelfService from "./components/SelfService";
import Administration from "./components/Administration";
import AccountSetup from "./components/AccountSetup";
import SignOut from "./components/SignOut";
import PeriodLP from "./components/Period/PeriodLP";
import PeriodDtl from "./components/Period/PeriodDtl";
import SongLP from "./components/Songs/SongLP";
import SongDtl from "./components/Songs/SongDtl";
import SongSchedulerMstr from "./components/Songs/SongSchedulerMstr";
import ServantLP from "./components/Servants/ServantLP";
import ServantDtl from "./components/Servants/ServantDtl";
import ServantSchedulerMstr from "./components/Servants/ServantSchedulerMstr";

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand>
            <NavLink className="nav-link" to="/">GSKI Rehuel</NavLink>
          </Navbar.Brand> 
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavLink className="nav-link" to="/Calendar">Calendar</NavLink>
              <NavLink className="nav-link" to="/SelfService">Self Service</NavLink>
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
          <Route path="/SelfService" component={SelfService}/>
          <Route path="/Administration" component={Administration}/>
          <Route path="/AccountSetup" component={AccountSetup}/>
          <Route path="/SignOut" component={SignOut}/>
          <Route path="/PeriodLP" component={PeriodLP}/>
          <Route path="/PeriodDtl" component={PeriodDtl}/>
          <Route path="/SongLP" component={SongLP}/>
          <Route path="/SongDtl" component={SongDtl}/>
          <Route path="/SongSchedulerMstr" component={SongSchedulerMstr}/>
          <Route path="/ServantLP" component={ServantLP}/>
          <Route path="/ServantDtl" component={ServantDtl}/>
          <Route path="/ServantSchedulerMstr" component={ServantSchedulerMstr}/>
        </div>

      </BrowserRouter>
    );
  }
}

export default App;
