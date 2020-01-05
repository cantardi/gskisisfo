import React, { Component } from 'react';
import { Form, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import {history} from '../../helpers/function'
import { formatDate, parseDate } from 'react-day-picker/moment';
import 'moment/locale/it';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MessageModal from '../MessageModal';

class ServantDtl extends Component {

  constructor(props){
    super(props);
    const servant = this.props.location.state;

    window.scrollTo(0, 0);
    this.PAGE_PARENT = './ServantLP'

    if (typeof servant === 'undefined') {
      this.state = {
        genderLists: [],
        servantid: '',
        servantname: '',
        gender: '',
        birthdate: '',
        email: '',
        mobile1: '',
        mobile2: '',
        schedulingflag: false,
        msgModalShow: false, 
        msgModalContent: '',
        msgModalHeader: '',
        variant: '',
        formErrorMsg: ''
      }
    }
    else {
      this.state = {
        genderLists: [],
        servantid: servant.id,
        servantname: servant.servantname,
        gender: servant.gender,
        birthdate: formatDate(new Date(servant.birthdate)),
        email: servant.email,
        mobile1: servant.mobile1,
        mobile2: servant.mobile2,
        schedulingflag: servant.schedulingflag,
        msgModalShow: false, 
        msgModalContent: '',
        msgModalHeader: '',
        variant: '',
        formErrorMsg: ''
      }
    }
  }

  handleServantDetailChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleChecked = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleDayChange = (day) => {
    this.setState({ birthdate: day });
  }

  trimInputValue = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }
  
  validateForm = () => {
    const { servantname, gender, birthdate, email, mobile1 } = this.state

    if (servantname === '' || gender === '' || birthdate === '' || email === '' || mobile1 === '') { 
      const text = "One or more input fields are not completed in the form. Please complete all fields with asterisk (*) in the form in order to save."
      this.setState({ variant: 'danger', formErrorMsg: text })
    }
    else {
      this.setState({ variant: '', formErrorMsg: '' })
      return true
    }
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
    history.push('/ServantLP')
  }

  callGetMasterFieldValuesAPI = () => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getfieldvalues/Gender', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(data => this.setState({ genderLists: data }))
    .catch(err => console.log('Fail to call getfieldvalues API: ' + err)) 
    
  }

  callAddServantAPI = () => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/addservant', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servantname: this.state.servantname,
        gender: this.state.gender,
        birthdate: new Date(this.state.birthdate).toLocaleDateString(),
        email: this.state.email,
        mobile1: this.state.mobile1,
        mobile2: this.state.mobile2,
        schedulingflag: this.state.schedulingflag,
      })
    })
    .then(response => response.json())
    .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))     
    .catch(err => console.log('Fail to call addservant API: ' + err))

  }

  callUpdateServantAPI = () => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/updateservant', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servantid: this.state.servantid,
        servantname: this.state.servantname,
        gender: this.state.gender,
        birthdate: new Date(this.state.birthdate).toLocaleDateString(),
        email: this.state.email,
        mobile1: this.state.mobile1,
        mobile2: this.state.mobile2,
        schedulingflag: this.state.schedulingflag,
      })
    })
    .then(response => response.json())
    .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))     
    .catch(err => console.log('Fail to call updateservant API: ' + err))

  }

  saveServant = () => {
    if (this.validateForm() === true){
      if (this.state.servantid === ''){
        this.callAddServantAPI();
      }
      else {
        this.callUpdateServantAPI();
      } 
    }
  }

  componentDidMount() {
    this.callGetMasterFieldValuesAPI();
  }
  
  render() {

    return (
      <Container className="pa2">

        <h1>Maintain Servant</h1>

        <Row>
          <Col className="tr">
            <Button className="ma1" onClick={ this.saveServant }> 
              Save
            </Button> 
            <Button className="ma1" onClick={ ()=>history.push(this.PAGE_PARENT) }>
              Cancel
            </Button> 
          </Col>
        </Row>
        
        <Alert className="mt2 mb2" variant={ this.state.variant }>{ this.state.formErrorMsg }</Alert>
        
        <Form>
                
          <Form.Group controlId="formServantName">
            <Form.Label>Servant Name *</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter servant name" 
              name="servantname"
              value={ this.state.servantname } 
              onChange={ this.handleServantDetailChange }
              onBlur={ this.trimInputValue }
            />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGender">
              <Form.Label>Gender *</Form.Label>
              <Form.Control 
                as="select" 
                name="gender"
                value={ this.state.gender } 
                onChange={ this.handleServantDetailChange }
              >
                <option value="">Choose...</option>
                {
                  this.state.genderLists.length > 0 &&
                  this.state.genderLists.map(gender => {
                    return (
                      <option key={ gender.id } value={ gender.id }>{ gender.description }</option> 
                    )
                  })
                }
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formDob">
              <Form.Label>Date of Birth *</Form.Label>
              <div>
              <DayPickerInput
                placeholder={`${formatDate(new Date())}`}
                name="birthdate"
                value={ this.state.birthdate }
                inputProps={ {className: 'form-control'} }
                formatDate={ formatDate }
                parseDate={ parseDate }
                onDayChange={ this.handleDayChange }
              />
              </div>
            </Form.Group>

          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formEmail">
              <Form.Label>Email *</Form.Label>
              <Form.Control 
                placeholder="Enter email" 
                name="email"
                value={ this.state.email } 
                onChange={ this.handleServantDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formMobile1">
              <Form.Label>Mobile 1 *</Form.Label>
              <Form.Control 
                placeholder="Enter first mobile" 
                name="mobile1"
                value={ this.state.mobile1 }
                onChange={ this.handleServantDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formMobile2">
              <Form.Label>Mobile 2</Form.Label>
              <Form.Control 
                placeholder="Enter second mobile" 
                name="mobile2"
                value={ this.state.mobile2 }
                onChange={ this.handleServantDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check 
              label="Available for Scheduling" 
              name="schedulingflag"
              checked={ this.state.schedulingflag }
              onChange={ this.handleChecked }
            />
          </Form.Group>

        </Form>

        <MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent }
        />
      </Container>
    );
  }
  
}
 
export default ServantDtl;