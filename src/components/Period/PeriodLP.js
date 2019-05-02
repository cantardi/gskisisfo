import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import PeriodSearch from "./PeriodSearch";
import PeriodResult from "./PeriodResult";

class PeriodLP extends Component {
  constructor(props){
    super(props);
    this.state = {
      periodList: [{
        name: 'JANUARI-2019-8AM',
        status: 'Active',
        description: 'Ibadah Raya 1 Periode Jan-2019',
      }],
      searchClicked: false,
    }
  }
  
  searchPeriod = () => {
    this.setState({ searchClicked: true })
  }

  openEditMode = () => {
    this.props.history.push('/PeriodDtl')
  }
  
  render() {
    return (
      <Container className="pa2">
        <DropdownButton className="ma2"
                          title="Action"
                          id="dropdown-secondary-button"
                          key="PeriodAction"
                          align="right">               
          <Dropdown.Item onClick={()=> this.props.history.push('/PeriodDtl')}>Add New Period</Dropdown.Item>
        </DropdownButton>

        <PeriodSearch searchPeriod={ this.searchPeriod } />
        {
          this.state.searchClicked === true &&
          <PeriodResult periodList={ this.state.periodList } openEditMode={ this.openEditMode } />
        }
        
      </Container>
    );
  }
}

export default PeriodLP;
