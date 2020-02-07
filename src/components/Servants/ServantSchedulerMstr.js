import React, { Component } from 'react';
import { Form, Container, Button } from 'react-bootstrap';
import { history } from '../../helpers/function'
import { callGetSchedulingPeriodAPI, callGetServantAPI, callAddServantSchedAPI, callGetSchedServantTemplateAPI, callGetPeriodDateAPI } from '../../helpers/apicall';
import MessageModal from '../MessageModal';
import ServantSchedulerStep1 from './ServantSchedulerStep1';
import ServantSchedulerStep2 from './ServantSchedulerStep2';
import ServantSchedulerStep3 from './ServantSchedulerStep3';

class ServantSchedulerMstr extends Component {

  constructor() {
    super()
    
    this.state = {
      currentStep: 1,
      periodList: [],
      selectedPeriod: '',
      displayedDates: [],
      selectedServants: [],
      servantList: [], 
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      isValidated: false,
    }
  
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
    if (this.state.currentStep === 3) history.push('ServantLP');
  }

  _next = () => {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({ currentStep })
    this.validateServantCompletion();
  }
    
  _prev = () => {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({ currentStep })
  }

  _submit = () => {

    if (window.confirm('Are you sure to submit this schedule?')) {
      
      const servantSchedule = 
        this.state.selectedServants
        .filter(servant => servant.servantid !== '')
        .map(servant => ({
          periodid: Number(this.state.selectedPeriod),
          dateid: servant.dateid,
          roleid: servant.roleid,
          servantid: Number(servant.servantid)
        }))

      callAddServantSchedAPI(servantSchedule)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))

    }

  }

  get previousButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 1, then render the "previous" button
    if(currentStep !==1){
      return (
        <Button 
          bsPrefix="btn-custom" 
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
          bsPrefix="btn-custom"
          className="float-right" 
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
          bsPrefix="btn-custom"
          className="float-right" 
          onClick={this._submit}>
        Submit
        </Button>        
      )
    }
    // ...else render nothing
    return null;
  }
  
  handlePeriodChange = (e) => {
    
    this.setState({ selectedPeriod: Number(e.target.value), displayedDates: [], selectedServants: [] });
    
    if (e.target.value !== '') {
      callGetPeriodDateAPI(Number(e.target.value))
      .then(
        data => this.setState({ displayedDates: data }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))

      callGetSchedServantTemplateAPI(Number(e.target.value))
      .then(
        data => this.setState({ selectedServants: data }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
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
      let error = 'Servant is already tagged to other role. Please select another person';
      this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error })
    }
    else {
      let foundIndex = selectedServants.findIndex(updatedItem => updatedItem.dateid === dateid && updatedItem.roleid === roleid)
      selectedServants.splice(foundIndex, 1, updatedServant)
      
      this.setState({ selectedServants });
    }
  }

  componentDidMount(){

    callGetSchedulingPeriodAPI()
    .then(
      data => this.setState({ periodList: data }),
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

    callGetServantAPI()
    .then(
      data => this.setState({ servantList: data }),
      error => this.setState({ servantList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
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
              periodList={ this.state.periodList }
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