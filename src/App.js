import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Route, Link, Router } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Calendar from "./components/Calendar";
import SelfService from "./components/SelfService";
import ViewSchedule from "./components/SelfService/ViewSchedule";
import SelectSong from "./components/SelfService/SelectSong";
import ReqSubstitution from "./components/SelfService/ReqSubstitution";
import Administration from "./components/Administration";
import AccountSetup from "./components/AccountSetup";
import MasterFieldList from "./components/Template/MasterFieldList";
import MasterDataLP from "./components/Template/MasterDataLP";
import PeriodLP from "./components/Period/PeriodLP";
import PeriodDtl from "./components/Period/PeriodDtl";
import SongLP from "./components/Songs/SongLP";
import SongDtl from "./components/Songs/SongDtl";
import SongSchedulerMstr from "./components/Songs/SongSchedulerMstr";
import ServantLP from "./components/Servants/ServantLP";
import ServantDtl from "./components/Servants/ServantDtl";
import ServantSchedulerMstr from "./components/Servants/ServantSchedulerMstr";
import ScheduleLP from "./components/Schedule/ScheduleLP";
import MaintainSchedule from "./components/_reusables/R_MaintainSchedule";
import ServiceLP from "./components/Service/ServiceLP";
import ServiceMstr from "./components/Service/ServiceMstr";
import {PrivateRoute} from './components/PrivateRoute';
import {authenticationService} from './services/authenticationService';
import {history} from './helpers/function'

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      //isSignedIn: false,
      //user: null,
      currentUser: null,
      isAdmin: false
    }
  }

  signInToSystem = (returnedUser) => {
    if (returnedUser.length > 0) {
      this.setState({ isSignedIn: true, user: returnedUser} )
    }
  }

  signOut = () => {
    if (window.confirm('You are about to log out from the system. Click OK to continue')) {
      //this.setState({ isSignedIn: false })
      
      authenticationService.logout();
      history.push('/Login');
    }
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x => this.setState({
        currentUser: x,
        isAdmin: x && x.role === 'Admin'
    }));
  }

  render() {
    
    const { currentUser, isAdmin } = this.state;

    return (
        <Router history={history}>
          {currentUser &&
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Navbar.Brand>
                <Nav.Link as={Link} eventKey="1" className="nav-link" to="/">GSKI Rehuel</Nav.Link>
              </Navbar.Brand> 
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={Link} eventKey="2" className="nav-link" to="/Calendar">Calendar</Nav.Link>
                  <Nav.Link as={Link} eventKey="3" className="nav-link" to="/SelfService">Self Service</Nav.Link>
                  { isAdmin && <Nav.Link as={Link} eventKey="4" className="nav-link" to="/Administration">Administration</Nav.Link> }
                </Nav>
                <Nav>
                  <Nav.Link as={Link} eventKey="4" className="nav-link" to="/AccountSetup">Account</Nav.Link>
                  <div className="nav-link pointer" onClick={this.signOut}>Sign Out</div>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          }
          <div className="content">
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/Calendar" component={Calendar}/>
            <PrivateRoute path="/SelfService" component={SelfService}/>
            <PrivateRoute path="/ViewSchedule" component={ViewSchedule}/>
            <PrivateRoute path="/MaintainSchedule" component={MaintainSchedule}/>
            <PrivateRoute path="/SelectSong" component={SelectSong}/>
            <PrivateRoute path="/ReqSubstitution" component={ReqSubstitution}/>
            <PrivateRoute path="/AccountSetup" component={AccountSetup}/>
            <PrivateRoute path="/Administration" roles="Admin" component={Administration} />
            <PrivateRoute path="/PeriodLP" roles="Admin" component={PeriodLP}/>
            <PrivateRoute path="/PeriodDtl" roles="Admin" component={PeriodDtl}/>
            <PrivateRoute path="/SongLP" roles="Admin" component={SongLP}/>
            <PrivateRoute path="/SongDtl" roles="Admin" component={SongDtl}/>
            <PrivateRoute path="/SongSchedulerMstr" roles="Admin" component={SongSchedulerMstr}/>
            <PrivateRoute path="/ServantLP" roles="Admin" component={ServantLP}/>
            <PrivateRoute path="/ServantDtl" roles="Admin" component={ServantDtl}/>
            <PrivateRoute path="/ServantSchedulerMstr" roles="Admin" component={ServantSchedulerMstr}/>
            <PrivateRoute path="/MasterFieldList" roles="Admin" component={MasterFieldList}/>
            <PrivateRoute path="/ScheduleLP" roles="Admin" component={ScheduleLP}/>
            <PrivateRoute path="/ServiceLP" roles="Admin" component={ServiceLP}/>
            <PrivateRoute path="/ServiceMstr" roles="Admin" component={ServiceMstr}/>
            <PrivateRoute path="/MasterDataLP" roles="Admin" component={MasterDataLP}/>

            <Route path="/Login" component={Login} />
          </div>

        </Router>
      
    );
  }
}

export default App;

