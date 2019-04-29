import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import SongLP from "./SongLP";
import SongDtl from './SongDtl';
import SongSchedulerMstr from './SongSchedulerMstr';

class SongManagement extends Component {

  render() {
    return (
      <Container className="pa2">

        <HashRouter>
          
          <DropdownButton className="ma2"
                          title="Action"
                          id="dropdown-secondary-button"
                          key="songAction"
                          align="right">
            <Dropdown.Item><Link to="/songdtl">Add New Song</Link></Dropdown.Item>
            <Dropdown.Item><Link to="/songschdl">Schedule Song</Link></Dropdown.Item>
          </DropdownButton>
          
          <Switch>
            <Route exact path="/" component={SongLP} />
            <Route path="/songdtl" component={SongDtl} />
            <Route path="/songschdl" component={SongSchedulerMstr} />
          </Switch>

        </HashRouter>
        
      </Container>
    );
  }
}

export default SongManagement;
