import React, { Component } from "react";
import { Form, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import MessageModal from '../MessageModal';
import {authenticationService} from '../../services/authenticationService';
import {history} from '../../helpers/function'

class ReqSubstitution extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      allperiod: [],
      selectedPeriod: '',
      currentRole: '',
      displayedDates: [],
      selectedDate: '',
      reasonDetail: '',
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
      variant: '',
      formErrorMsg: ''
    }
    
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  handlePeriodChange = (e) => {
    this.setState({ selectedPeriod: e.target.value, displayedDates: [], currentRole: '' });
    this.callGetPeriodDateAPI(e.target.value);
  }

  handleDateChange = (e) => {
    
    var dateid = e.target.value

    if (dateid !== ''){
      this.callRoleValidationAPI(dateid)
      .then(eligibleUser => {
        if (eligibleUser.length === 0){
          let msg = "You are not scheduled as any role on this date. Only eligible servant can request for substitution song for this date."
          this.setState({ selectedDate: '', currentRole: '', msgModalShow: true , msgModalHeader: 'Information', msgModalContent: msg })
        }
        else{
          this.setState({ selectedDate: dateid, currentRole: eligibleUser[0].rolename });
        }
      })
      .catch(() => this.setState({ selectedDate: '', currentRole: '', msgModalShow: true , msgModalHeader: 'Information', msgModalContent: "Servant schedule for this date is not available yet" }))
    }
    else {
      this.setState({ selectedDate: '' });
    }

  }

  handleReasonChange = (e) => {
    this.setState({ reasonDetail: e.target.value })
  }

  returnDateValue = (dateid) => {
    return DateConvert(new Date(this.state.displayedDates.filter(date => date.id === Number(dateid))[0].predefineddate))
  }

  returnPeriodName = (periodid) => {
    return this.state.allperiod.filter(period => period.id === Number(periodid))[0].description
  }

  validateForm = () => {

    const { selectedPeriod, selectedDate, reasonDetail } = this.state

    if (selectedPeriod === '' || selectedDate === '' || reasonDetail === '') {
      const text = "One or more input fields are not completed in the form. Please complete all fields with asterisk (*) in the form in order to save."
      this.setState({ variant: 'danger', formErrorMsg: text })
    }
    else {
      this.setState({ variant: '', formErrorMsg: '' })
      return true
    }

  }
  
  submitRequest = () => {
    if (this.validateForm() === true){
      if (window.confirm('Are you sure you wish to submit this substitution request? Scheduling administrator will get notification for your request after you click OK.')) {
        this.callSubmitSubsitutionAPI();
        this.callNotifyAdminAPI();
      }
    }
  }

  callNotifyAdminAPI = () => {

/*
    fetch(process.env.REACT_APP_BACKEND_URL + '/sendemailbyservice', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servicedateid: this.state.selectedDate,
        servicedate: this.returnDateValue(this.state.selectedDate),
        periodname: this.returnPeriodName(this.state.selectedPeriod),

      })
    })
    .then (response => response.json())
    .then(data => alert(data))
    .then(() => {
      this.setState({ selectedPeriod: '' });
      this.setState({ selectedDate: '' });
      this.setState({ displayedDates: [] });
    })
    .catch(err => console.log("Fail to call sendemailbyservice API --- " + err))     
  */
  }

  callGetPeriodAPI = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/getperiod', {
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
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperiodapi: ' + err))
  }

  callGetPeriodDateAPI = (periodid) => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getperioddate/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => data.filter(date => new Date(date.predefineddate) > new Date()))
        .then(finalDate => this.setState({ displayedDates: finalDate }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperioddateforselection --- ' + err))
  }

  callRoleValidationAPI = (dateid) => {
    let user = authenticationService.currentUser;
    
    return fetch(process.env.REACT_APP_BACKEND_URL + '/getservantbydate/' + dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => data.filter(schedule => schedule.servantid === Number(user.source._value.servantid)))
      }
    }) 
    .catch(err => console.log("Fail to call getservantbydate api: " + err))
		
  }

  callSubmitSubsitutionAPI = () => {
/*
    fetch(process.env.REACT_APP_BACKEND_URL + '/saveselectedsong', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        selectedSongs: selectedSongs
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
    .catch(err => console.log('Fail to call saveselectedsong API: ' + err))
*/
  }

  componentDidMount(){
    this.callGetPeriodAPI();
  }

  render() {
    
    return ( 
      <Container className="pa2">   
        
        <h1>Request for Substitution</h1>
        
        <br/>

        <Form.Group>
          <Form.Label>Requested Period*</Form.Label>
          <Form.Control 
            as="select" 
            name="status"
              value={ this.state.selectedPeriod }
              onChange={ this.handlePeriodChange }
            >
              <option key="0" value="">Select Period</option>
              {
                this.state.allperiod.length > 0 &&
                this.state.allperiod.map((period) => 
                  <option key={ period.id } value={ period.id }>
                    { period.description }
                  </option>
                )
              }
            </Form.Control>
          </Form.Group>
  
          <Form.Group>
            <Form.Label>Requested Date*</Form.Label>
            <Form.Control 
              as="select" 
              name="status"
                value={ this.state.selectedDate }
                onChange={ this.handleDateChange }
              >
                <option key="0" value="">Select Date</option>
                {
                  this.state.displayedDates.length > 0 &&
                  this.state.displayedDates.map((date) => 
                    <option key={ date.id } value={ date.id }>
                      { DateConvert(new Date(date.predefineddate)) }
                    </option>
                  )
                }
            </Form.Control>
          </Form.Group>
          
          <Form.Group controlId="formCurrentRole">
            <Form.Label>Your Current Role</Form.Label>
            <Form.Control
              readOnly 
              type="text"
              name="currentRole"
              value={ this.state.currentRole }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Reason for your request*</Form.Label>
            <Form.Control 
              type="text"
              placeholder="e.g. Health issue, family matter, accident, etc" 
              name="reasonDetail"
              value={ this.state.reasonDetail } 
              onChange={ this.handleReasonChange }
              onBlur={ this.trimInputValue }
            />
          </Form.Group>

          <Alert className="mt2 mb2" variant={ this.state.variant }>{ this.state.formErrorMsg }</Alert>

          <Row>
            <Col className="tr">
              <Button className="ma1" onClick={ this.submitRequest }> 
                Submit
              </Button> 
              <Button className="ma1" onClick={ ()=>history.push('/SelfService') }>
                Cancel
              </Button> 
            </Col>
          </Row>

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
 
export default ReqSubstitution;