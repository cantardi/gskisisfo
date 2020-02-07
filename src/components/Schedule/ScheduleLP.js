import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { callSearchPeriodAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function';
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

    const { searchPeriodName, searchPeriodStatus, searchDescription } = this.state;
    
    callSearchPeriodAPI(searchPeriodName, searchPeriodStatus, searchDescription)
    .then(
      data => this.setState({ periodList: data }),
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  clearSearch = () => {
    this.setState({
      searchPeriodName: '',
      searchPeriodStatus: 'A',
      searchDescription: '',
      periodList: []
    })
  }

  updatePeriod = (period) => {
    history.push('MaintainSchedule', { period, PAGE_PARENT: 'ScheduleLP', editFlag: true, notifyFlag: true })
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
              updatePeriod={ this.updatePeriod }
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
