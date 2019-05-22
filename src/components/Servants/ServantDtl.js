import React, { Component } from "react";
import { Form, Col, Button, Container } from "react-bootstrap";
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/it';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MessageModal from "../MessageModal";

class ServantDtl extends Component {

  constructor(props){
    super(props);
    const servant = this.props.location.state;
    window.scrollTo(0, 0);
    if (typeof servant === 'undefined') {
      this.state = {
        servantid: '',
        servantname: '',
        gender: '',
        birthdate: '',
        email: '',
        mobile1: '',
        mobile2: '',
        schedulingflag: false,
        modalShow: false, 
        modalMsg: '',
        modalHdr: '',
      }
    }
    else {
      this.state = {
        servantid: servant.id,
        servantname: servant.servantname,
        gender: servant.gender,
        birthdate: new Date(servant.birthdate).toLocaleDateString(),
        email: servant.email,
        mobile1: servant.mobile1,
        mobile2: servant.mobile2,
        schedulingflag: servant.schedulingflag,
        modalShow: false, 
        modalMsg: '',
        modalHdr: '',
      }
    }
    
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleChecked = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleDayChange = (day) => {
    this.setState({ birthdate: new Date(day).toLocaleDateString() });
  }

  formatInput = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  modalClose = () => this.props.history.push('/ServantLP')

  saveServant = () => {
    
    if (this.state.servantid === ''){
      
      fetch('http://localhost:3001/addservant', {
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
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Information', modalMsg: data }))
        }
        else { 
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
        }})
      .catch(err => console.log)
    }
    else {
      
      fetch('http://localhost:3001/updateservant', {
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
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ modalShow: true , modalHdr: 'Information', modalMsg: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
      }
    }) 
    .catch(err => console.log)
    }  

  }

  render() {
      return (

        <Container className="pa2">

          <h1>Maintain Servant</h1>

          <Form className="pa2">
            
            <Form.Row>
              <Col className="tr">
                <Button className="ma1" onClick={ this.saveServant }> 
                  Save
                </Button> 
                <Button className="ma1" onClick={ ()=>this.props.history.push('/ServantLP') }>
                  Cancel
                </Button> 
              </Col>
            </Form.Row>
            
            <Form.Group controlId="formServantName">
              <Form.Label>Servant Name *</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter servant name" 
                name="servantname"
                value={ this.state.servantname } 
                onChange={ this.handleChange }
                onBlur={ this.formatInput }
              />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGender">
                <Form.Label>Gender *</Form.Label>
                <Form.Control 
                  as="select" 
                  name="gender"
                  value={ this.state.gender } 
                  onChange={ this.handleChange }
                >
                  <option value="">Choose...</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
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
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formMobile1">
                <Form.Label>Mobile 1 *</Form.Label>
                <Form.Control 
                  placeholder="Enter first mobile" 
                  name="mobile1"
                  value={ this.state.mobile1 }
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formMobile2">
                <Form.Label>Mobile 2</Form.Label>
                <Form.Control 
                  placeholder="Enter second mobile" 
                  name="mobile2"
                  value={ this.state.mobile2 }
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
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
            show={ this.state.modalShow }
            onHide={ this.modalClose }
            header={ this.state.modalHdr }
            errmsg={ this.state.modalMsg }
          />
          
        </Container>
    );
  }
}
 
export default ServantDtl;