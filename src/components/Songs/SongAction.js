import React from 'react';
import { Container } from 'react-bootstrap';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from "react-router-dom";

const SongAction = () => {
  return (
    <Container>
      <HashRouter>              
        <DropdownButton className="ma2"
												title="Action"
												id="dropdown-secondary-button"
												key="songAction"
												align="right">
          <Dropdown.Item><Link to="/songdtl">Add New Song</Link></Dropdown.Item>
          <Dropdown.Item><Link to="/songdtl">Schedule Song</Link></Dropdown.Item>
        </DropdownButton>
                    
        <Switch>
        	<Route path="/songdtl" component={SongDtl} />
          <Route path="/songschdl" component={SongSchedulerMstr} />
        </Switch>
 
      </HashRouter>
    </Container>
        
    )
}

export default SongAction;