import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { callSearchPeriodAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function';
import PeriodSearch from './PeriodSearch';
import PeriodResult from './PeriodResult';
import MessageModal from '../MessageModal';

class PeriodLP extends Component {
  
  constructor(props){
    super(props);

    this.PAGE_CHILD = 'PeriodDtl';
    this.PAGE_PARENT = 'Administration';

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
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
  }

  clearSearch = () => {
    this.setState({ searchPeriodName: '', searchPeriodStatus: 'A', searchDescription: '', periodList: []});
  }

  addPeriod = () => {
    history.push(this.PAGE_CHILD);
  }

  updatePeriod = (period) => {
    history.push(this.PAGE_CHILD, period);
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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

export default PeriodLP;
