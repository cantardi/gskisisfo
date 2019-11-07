import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import PeriodSearch from './PeriodSearch';
import PeriodResult from './PeriodResult';
import MessageModal from '../MessageModal';

class PeriodLP extends Component {
  
  constructor(props){
    super(props);

    this.PAGE_CHILD = './PeriodDtl';
    this.state = {
      periodList: [],
      searchPeriodName: '',
      searchPeriodStatus: 'A',
      searchDescription: '',
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
    }

  }
  
  handlePeriodSearchChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  callSearchPeriodAPI = () => {
    fetch('https://gskisisfobackend.herokuapp.com/searchPeriod', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        periodname: this.state.searchPeriodName,
        periodstatus: this.state.searchPeriodStatus,
        description: this.state.searchDescription,
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ periodList: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log("Fail to call searchperiod API: " + err)) 
  }

  searchPeriod = () => {
    this.setState({ periodList: [] })
    this.callSearchPeriodAPI();
  }

  clearSearch = () => {
    this.setState({
      searchPeriodName: '',
      searchPeriodStatus: 'A',
      searchDescription: '',
      periodList: []
    })
  }

  addPeriod = () => {
    this.props.history.push(this.PAGE_CHILD);
  }

  updatePeriod = (period) => {
    this.props.history.push(this.PAGE_CHILD, period);
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  render() {
    return (
      <Container className="pa2">
        <DropdownButton 
          className="ma2"
          title="Action"
          id="dropdown-secondary-button"
          key="PeriodAction"
          align="right"
        >
          <Dropdown.Item onClick={ this.addPeriod }>Add New Period</Dropdown.Item>
        </DropdownButton>

        <PeriodSearch 
          periodName={ this.state.searchPeriodName }
          periodStatus={ this.state.searchPeriodStatus }
          description={ this.state.searchDescription }
          searchPeriod={ this.searchPeriod } 
          clearSearch={ this.clearSearch } 
          handleChange={ this.handlePeriodSearchChange }
        />

        {
          this.state.periodList.length > 0 
          ? 
          <div>
            <div className="alert alert-info" role="alert">
              Search feature will display only the first 20 rows.
              Please filter your search for optimum result.
            </div>
            <PeriodResult 
              periodList={ this.state.periodList } 
              openEditMode={ this.updatePeriod }
            />
          </div>
          :
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        }
        
        <MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent }
        />
        
      </Container>
    )
  }
  
}

export default PeriodLP;
