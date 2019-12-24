import React, { Component } from 'react';
import { Form, Container, Button } from 'react-bootstrap';
import MessageModal from '../MessageModal';
import ServantSchedulerStep1 from './ServantSchedulerStep1';
import ServantSchedulerStep2 from './ServantSchedulerStep2';
import ServantSchedulerStep3 from './ServantSchedulerStep3';

class ServantSchedulerMstr extends Component {

  constructor() {
    super()
    
    this.state = {
      currentStep: 1,
      allperiod: [],
      selectedPeriod: '',
      displayedDates: [],
      selectedServants: [],
      churchRoles: [],
      servantList: [], 
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      isValidated: false,
    }
    
    this._next = this._next.bind(this)
    this._prev = this._prev.bind(this)
    this._submit = this._submit.bind(this)
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
    this.props.history.push('/ServantLP')
  }

  _next() {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({ currentStep })
    this.validateServantCompletion();
  }
    
  _prev() {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({ currentStep })
  }

  _submit() {

    if (window.confirm('Are you sure you wish to submit this schedule?')) {
      this.callScheduleServantAPI();
    }

  }

  get previousButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 1, then render the "previous" button
    if(currentStep !==1){
      return (
        <Button 
          className="btn btn-secondary" 
          onClick={this._prev}>
        Previous
        </Button>
      )
    }
    // ...else return nothing
    return null;
  }

  get nextButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if(currentStep <3 && this.state.displayedDates.length > 0){
      return (
        <Button 
          className="btn btn-primary float-right" 
          onClick={this._next}>
        Next
        </Button>        
      )
    }
    // ...else render nothing
    return null;
  }

  get submitButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if(currentStep === 3 && this.state.isValidated){
      return (
        <Button 
          className="btn btn-primary float-right" 
          onClick={this._submit}>
        Submit
        </Button>        
      )
    }
    // ...else render nothing
    return null;
  }
  
  callGetPeriodAPI = () => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getschedulingperiod/servant', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ allperiod: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperiod API: ' + err))

  }

  callGetPeriodDateAndGetRoleAPI = (periodid) => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getperioddate/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => {
          let dateIdArray = [];
          this.setState({ displayedDates: data })
          data.map(dateId => dateIdArray.push(dateId.id))
          return dateIdArray
        })
        .then(dateIdArray => {
          fetch(process.env.REACT_APP_BACKEND_URL + '/getfieldvalues/Role List', {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
          })
          .then (response => {
            if (response.status === 200){
              return response.json()
              .then(data => {
                
                this.setState({ churchRoles: data })

                let { selectedServants } = this.state
                
                dateIdArray.map(dateId => {
                  return (
                    data.map(data => {
                      return (
                        selectedServants.push({
                          dateid: dateId,
                          roleid: data.id,
                          rolename: data.description,
                          servantid: '',
                          servantname: ''
                        })
                      )
                    })
                  )
                })
                
                this.setState({ selectedServants })
              })
           }
          })
        }) 
    .catch(err => console.log('Fail to call getperioddate/getchurchrole API: ' + err))
      }
    })
  }

  callGetServantAPI = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/getservant', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ servantList: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getservant API: ' + err))

  }

  callScheduleServantAPI = () => {
    const servantSchedule = this.state.selectedServants
                            .filter(servant => servant.servantid !== '')
                            .map(servant =>
                              ({
                                periodid: Number(this.state.selectedPeriod),
                                dateid: servant.dateid,
                                roleid: servant.roleid,
                                servantid: Number(servant.servantid)
                              })
                            )

    fetch(process.env.REACT_APP_BACKEND_URL + '/scheduleservant', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servantSchedule: servantSchedule
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
    }})
    .catch(err => console.log('Fail to call scheduleservant API: ' + err))
  }

  handlePeriodChange = (e) => {
    this.setState({ selectedPeriod: e.target.value });
    this.setState({ displayedDates: [] });
    this.setState({ selectedServants: [] });
    if (e.target.value !== '') {
      this.callGetPeriodDateAndGetRoleAPI(e.target.value);
    }
  }

  validateServant(servant) {
    return this.state.selectedServants
      .filter(selectedServant => selectedServant.dateid === servant.dateid && selectedServant.servantid === servant.servantid)
  }

  validateServantCompletion = () => {
    let dateIdList = this.state.displayedDates.map(date => date.id)
    let selectedIdList = this.state.selectedServants
                          .filter(servant => servant.servantid !== '')
                          .map(date => Number(date.dateid))
    let isValidated = dateIdList.every(val => selectedIdList.includes(val))
    this.setState({ isValidated })
  }

  selectServant = (event, dateid, roleid, rolename) => {
    
    const { selectedServants } = this.state;

    let updatedServant = {
      dateid: dateid,
      roleid: roleid,
      rolename: rolename,
      servantid: event.target.value,
      servantname: event.target.value !== ''? this.state.servantList.filter(servant => servant.id === Number(event.target.value))[0].servantname: ''
    }
    
    if (this.validateServant(updatedServant).length > 0 && event.target.value !== ''){
      alert('Servant is already tagged to other role. Please select another person')
    }
    else {
      let foundIndex = selectedServants.findIndex(updatedItem => updatedItem.dateid === dateid && updatedItem.roleid === roleid)
      selectedServants.splice(foundIndex, 1, updatedServant)
      
      this.setState({ selectedServants });
    }
  }

  componentDidMount(){
    this.callGetPeriodAPI();
    this.callGetServantAPI();
  }

  render() { 
    return (
      <Container className="pa2">
        
        <h1>Schedule Servant Wizard</h1>
        
        <React.Fragment>     
          <h4 className="mt4 mb4">Step {this.state.currentStep} > </h4> 
            
          <Form>
            <ServantSchedulerStep1
              currentStep={ this.state.currentStep } 
              selectedPeriod={ this.state.selectedPeriod }
              handlePeriodChange={ this.handlePeriodChange }
              allperiod={ this.state.allperiod }
              displayedDates={ this.state.displayedDates }
            />

            <ServantSchedulerStep2
              currentStep={ this.state.currentStep } 
              displayedDates={ this.state.displayedDates }
              selectedServants={ this.state.selectedServants }
              servantList={ this.state.servantList }
              selectServant={ this.selectServant }
            />

            <ServantSchedulerStep3
              currentStep={ this.state.currentStep } 
              displayedDates={ this.state.displayedDates }
              churchRoles={ this.state.churchRoles }
              selectedServants={ this.state.selectedServants }
              isValidated={ this.state.isValidated }
            />      

            <div>&nbsp;</div>

            {this.previousButton}
            {this.nextButton}
            {this.submitButton}

          </Form>
        </React.Fragment>

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
 
export default ServantSchedulerMstr;