import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import PeriodSearch from "./PeriodSearch";
import PeriodResult from "./PeriodResult";
import MessageModal from "../MessageModal";

class PeriodLP extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      periodList: [],
      searchPeriodName: '',
      searchPeriodStatus: '',
      searchDescription: '',
      modalShow: false, 
      modalMsg: '',
      modalHdr: '',
    }
  }
  
    
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  searchPeriod = () => {
    this.setState({ periodList: [] });
    
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
          .then(data => this.setState(Object.assign(this.state.periodList, data)))
        }
        else { 
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
        }
      }) 
      .catch(err => console.log)   
  }

  clearSearch = () => {
    this.setState({
      searchPeriodName: '',
      searchPeriodStatus: '',
      searchDescription: ''
    })
  }

  openEditMode = (period) => {
    this.props.history.push('/PeriodDtl', period);
  }

  modalClose = () => this.setState({ modalShow: false })
  
  routeToPage = (pagename) => {
    this.props.history.push(pagename);
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
          <Dropdown.Item onClick={ () => this.routeToPage('/PeriodDtl') }>Add New Period</Dropdown.Item>
        </DropdownButton>

        <PeriodSearch 
          periodName={ this.state.searchPeriodName }
          periodStatus={ this.state.searchPeriodStatus }
          description={ this.state.searchDescription }
          searchPeriod={ this.searchPeriod } 
          clearSearch={ this.clearSearch } 
          handleChange={ this.handleChange }
        />

        {
          this.state.periodList !== null &&
          <PeriodResult 
            periodList={ this.state.periodList } 
            openEditMode={ this.openEditMode }
          />
        }
        
        <MessageModal
          show={ this.state.modalShow }
          onHide={ this.modalClose }
          header={ this.state.modalHdr }
          errmsg={ this.state.modalMsg }
        />
        
      </Container>
    );
  }
}

export default PeriodLP;
