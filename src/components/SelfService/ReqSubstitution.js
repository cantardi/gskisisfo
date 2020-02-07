import React, { Component } from "react";
import { Form, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { authenticationService } from '../../services/authenticationService';
import { callGetPeriodAPI, callGetSSPeriodDateAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function'
import MessageModal from '../MessageModal';

class ReqSubstitution extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      periodList: [],
      selectedPeriod: '',
      currentRole: '',
      servantname: '',
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

    this.setState({ selectedPeriod: e.target.value, displayedDates: [], currentRole: '', variant: '', formErrorMsg: '' });

    callGetSSPeriodDateAPI(Number(e.target.value))
    .then(
      data => this.setState({ displayedDates: data }),
      error => this.setState({ selectedPeriod: '', displayedDates: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  handleDateChange = (e) => {
    
    var dateid = Number(e.target.value)

    if (dateid !== ''){

      this.callRoleValidationAPI(dateid)
      .then(eligibleUser => {
        if (eligibleUser.length === 0){
          let msg = "You are not scheduled as any role on this date. Only eligible servant can request for substitution for this date."
          this.setState({ selectedDate: '', currentRole: '', msgModalShow: true , msgModalHeader: 'Information', msgModalContent: msg })
        }
        else{
          this.setState({ selectedDate: dateid, currentRole: eligibleUser[0].rolename });
        }
      })
      .catch(() => this.setState({ selectedDate: '', currentRole: '', msgModalShow: true , msgModalHeader: 'Information', msgModalContent: 'Servant schedule for this date is not available yet. Please select other date' }))
    }
    else {
      this.setState({ selectedDate: '' });
    }

    this.setState({ variant: '', formErrorMsg: '' })
  }

  handleReasonChange = (e) => {
    this.setState({ reasonDetail: e.target.value, variant: '', formErrorMsg: '' })
  }

  returnDateValue = (dateid) => {
    return DateConvert(new Date(this.state.displayedDates.filter(date => date.id === Number(dateid))[0].predefineddate))
  }

  returnPeriodName = (periodid) => {
    return this.state.periodList.filter(period => period.id === Number(periodid))[0].description
  }

  validateForm = () => {

    const { selectedPeriod, selectedDate, reasonDetail } = this.state

    if (selectedPeriod === '' || selectedDate === '' || reasonDetail === '') {
      const text = "One or more input fields are not completed in the form. Please complete all fields with asterisk (*) in the form in order to save."
      this.setState({ variant: 'danger', formErrorMsg: text })
      return false
    }
    else {
      return true
    }

  }
  
  submitRequest = () => {
    if (this.validateForm() === true){
      if (window.confirm('Are you sure to submit this substitution request? Scheduling administrator will get notification for your request after you click OK.')) {
        this.callSubmitSubsitutionAPI();
        this.callNotifyAdminAPI();
      }
    }
  }

  callNotifyAdminAPI = () => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/sendadminemail', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servicedate: this.returnDateValue(this.state.selectedDate),
        periodname: this.returnPeriodName(this.state.selectedPeriod),
        servantname: this.state.servantname,
        rolename: this.state.currentRole,
        reason: this.state.reasonDetail
      })
    })
    .then(response => response.json())
    .then(data => alert(data))
    .then(() => {
      this.setState({ selectedPeriod: '', selectedDate: '', displayedDates: [], currentRole: '', reasonDetail: '' });
    })
    .catch(err => console.log("Fail to call sendemailbyservice API --- " + err))     

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

    const requestDtl = {
      periodid: Number(this.state.selectedPeriod),
      dateid: Number(this.state.selectedDate),
      servantid: authenticationService.currentUser.source._value.servantid,
      rolename: this.state.currentRole,
      reason: this.state.reasonDetail,
    }

    fetch(process.env.REACT_APP_BACKEND_URL + '/submitsubstitutionreq', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        requestDtl: requestDtl
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
    .catch(err => console.log('Fail to call submitsubstitutionreq API: ' + err))
    
  }

  componentDidMount(){

    window.scrollTo(0, 0);

    callGetPeriodAPI()
    .then(
      data => this.setState({ periodList: data }),
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

    this.setState({servantname: authenticationService.currentUser.source._value.servantname})

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
                this.state.periodList.length > 0 &&
                this.state.periodList.map((period) => 
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
              as="textarea"
              placeholder="e.g. Health issue, family matter, accident, etc" 
              name="reasonDetail"
              rows="3"
              value={ this.state.reasonDetail } 
              onChange={ this.handleReasonChange }
              onBlur={ this.trimInputValue }
            />
          </Form.Group>

          <Alert className="mt2 mb2" variant={ this.state.variant }>{ this.state.formErrorMsg }</Alert>

          <Row>
            <Col className="tr">
              <Button bsPrefix="btn-custom" className="ma1" onClick={ this.submitRequest }> 
                Submit
              </Button> 
              <Button bsPrefix="btn-custom" className="ma1" onClick={ ()=>history.push('/SelfService') }>
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