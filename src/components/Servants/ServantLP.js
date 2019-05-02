import React, { Component } from "react";
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import ServantSearch from "./ServantSearch";
import ServantResult from "./ServantResult";

class ServantLP extends Component {
  constructor(props){
    super(props);
    this.state = {
      servantList: [{
        name: 'Eveline Natasha',
        email: 'eveline.natasha@gmail.com',
        mobile: '081238901238',
      }],
      searchClicked: false,
    }
  }
  
  searchServant = () => {
    this.setState({ searchClicked: true})
  }

  openEditMode = () => {
    this.props.history.push('/ServantDtl')
  }

  render() {
    return(
      <Container className="pa2">
        <DropdownButton className="ma2"
                          title="Action"
                          id="dropdown-secondary-button"
                          key="songAction"
                          align="right">               
          <Dropdown.Item onClick={()=> this.props.history.push('/ServantDtl')}>Add New Servant</Dropdown.Item>
          <Dropdown.Item onClick={()=> this.props.history.push('/ServantSchedulerMstr')}>Schedule Servant</Dropdown.Item>
        </DropdownButton>

        <ServantSearch searchServant={ this.searchServant } />
        {
          this.state.searchClicked === true &&
          <ServantResult servantList={ this.state.servantList } openEditMode={ this.openEditMode } />
        }

      </Container>
    )
  }
}
 
export default ServantLP;