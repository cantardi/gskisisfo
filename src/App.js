import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Route, NavLink, Link, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Calendar from "./components/Calendar";
import SelfService from "./components/SelfService";
import Administration from "./components/Administration";
import AccountSetup from "./components/AccountSetup";
import MasterFieldList from "./components/Template/MasterFieldList";
import PeriodLP from "./components/Period/PeriodLP";
import PeriodDtl from "./components/Period/PeriodDtl";
import SongLP from "./components/Songs/SongLP";
import SongDtl from "./components/Songs/SongDtl";
import SongSchedulerMstr from "./components/Songs/SongSchedulerMstr";
import ServantLP from "./components/Servants/ServantLP";
import ServantDtl from "./components/Servants/ServantDtl";
import ServantSchedulerMstr from "./components/Servants/ServantSchedulerMstr";
import ScheduleMstr from "./components/Schedule/ScheduleMstr";
import ScheduleLP from "./components/Schedule/ScheduleLP";
import ServiceLP from "./components/Service/ServiceLP";
import ServiceMstr from "./components/Service/ServiceMstr";
import SelectSong from "./components/SelfService/SelectSong";
import MasterDataLP from "./components/Template/MasterDataLP";
import {userContext} from './helpers/userContext';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      user: null,
    }
  }

  signInToSystem = (returnedUser) => {
    if (returnedUser.length > 0) {
      this.setState({ isSignedIn: true, user: returnedUser})
    }
  }

  signOut = () => {
    if (window.confirm('You are about to log out from the system. Click OK to continue')) {
      this.setState({ isSignedIn: false })
    }
  }

  render() {
    
    if (this.state.isSignedIn === false){
      return (
        <Login signInToSystem={this.signInToSystem}/>
      )
    }
    else {
      return (
        <userContext.Provider value={this.state.user}>
          <BrowserRouter>
        
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Navbar.Brand>
                <Nav.Link as={Link} eventKey="1" className="nav-link" to="/">GSKI Rehuel</Nav.Link>
              </Navbar.Brand> 
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={Link} eventKey="2" className="nav-link" to="/Calendar">Calendar</Nav.Link>
                  <Nav.Link as={Link} eventKey="3" className="nav-link" to="/SelfService">Self Service</Nav.Link>
                  <Nav.Link as={Link} eventKey="4" className="nav-link" to="/Administration">Administration</Nav.Link>
                </Nav>
                <Nav>
                  <NavLink className="nav-link" to="/Account">Account</NavLink>
                  <div className="nav-link pointer" onClick={this.signOut}>Sign Out</div>
                </Nav>
              </Navbar.Collapse>
            </Navbar>

            <div className="content">
              <Route exact path="/" component={Home}/>
              <Route path="/Calendar" component={Calendar}/>
              <Route path="/SelfService" component={SelfService}/>
              <Route path="/Administration" component={Administration}/>
              <Route path="/AccountSetup" component={AccountSetup}/>
              <Route path="/PeriodLP" component={PeriodLP}/>
              <Route path="/PeriodDtl" component={PeriodDtl}/>
              <Route path="/SongLP" component={SongLP}/>
              <Route path="/SongDtl" component={SongDtl}/>
              <Route path="/SongSchedulerMstr" component={SongSchedulerMstr}/>
              <Route path="/ServantLP" component={ServantLP}/>
              <Route path="/ServantDtl" component={ServantDtl}/>
              <Route path="/ServantSchedulerMstr" component={ServantSchedulerMstr}/>
              <Route path="/MasterFieldList" component={MasterFieldList}/>
              <Route path="/ScheduleMstr" component={ScheduleMstr}/>
              <Route path="/ScheduleLP" component={ScheduleLP}/>
              <Route path="/SelectSong" component={SelectSong}/>
              <Route path="/ServiceLP" component={ServiceLP}/>
              <Route path="/ServiceMstr" component={ServiceMstr}/>
              <Route path="/MasterDataLP" component={MasterDataLP}/>
            </div>

          </BrowserRouter>
        </userContext.Provider>
      );
    }

  }
}

export default App;

