import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import PeriodSearch from '../Period/PeriodSearch';
import PeriodResult from '../Period/PeriodResult';
import MessageModal from '../MessageModal';

class ScheduleLP extends Component {
  
  constructor(props){
    super(props);

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

  searchPeriod = () => {
    this.setState({ periodList: [] })

    fetch('http://localhost:3001/searchPeriod', {
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

  clearSearch = () => {
    this.setState({
      searchPeriodName: '',
      searchPeriodStatus: 'A',
      searchDescription: '',
      periodList: []
    })
  }

  routeToPage = (pagename) => {
    this.props.history.push(pagename);
  }

  openEditMode = (period) => {
    this.props.history.push('/ScheduleMstr', period);
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  render() {
    return (
      <Container className="pa2">

        <PeriodSearch 
          periodName={ this.state.searchPeriodName }
          periodStatus={ this.state.searchPeriodStatus }
          description={ this.state.searchDescription }
          searchPeriod={ this.searchPeriod } 
          clearSearch={ this.clearSearch } 
          handleChange={ this.handlePeriodSearchChange }
        />

        {
          this.state.periodList.length > 0 &&
          <div>
            <div className="alert alert-info" role="alert">
              Search feature will display only the first 20 rows.
              Please filter your search for optimum result.
            </div>
            <PeriodResult 
              periodList={ this.state.periodList } 
              openEditMode={ this.openEditMode }
            />
          </div>
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

export default ScheduleLP;
