import React, { Component } from 'react';
import { Form, Modal, Alert, Row, Col, Button, Container, ListGroup } from 'react-bootstrap';
import DayPicker, { DateUtils } from 'react-day-picker';
import { history } from '../../helpers/function'
import { callGetPeriodDateAPI, callAddPeriodAPI, callUpdatePeriodDtlAPI, callUpdatePeriodWholeAPI } from '../../helpers/apicall';
import MessageModal from '../MessageModal';
import 'react-day-picker/lib/style.css';

class PeriodDtl extends Component {
  
  constructor(props){
    super(props);
    const period = this.props.location.state;
    
    this.PAGE_PARENT = 'PeriodLP';

    if (typeof period === 'undefined') {
      this.state = {
        periodId: '',
        periodName: '',
        status: 'A',
        description: '',
        selectedDays: [],
        msgModalShow: false, 
        msgModalContent1: '',
        msgModalContent2: '',
        msgModalHeader: '',
        variant: '',
        formErrorMsg: '',
        dateModalShow: false, 
        dayChangeFlag: false,
        overallChangeFlag: false
      }
    }
    else {
      this.state = {
        periodId: period.id,
        periodName: period.periodname,
        status: period.status,
        description: period.description,
        selectedDays: [], 
        msgModalShow: false,
        msgModalContent1: '',
        msgModalContent2: '',
        msgModalHeader: '',
        variant: '',
        formErrorMsg: '',
        dateModalShow: false,
        dayChangeFlag: false,
        overallChangeFlag: false
      }
    }

  }
  
  handleDayClick = (day, { selected }) => {
    const { selectedDays } = this.state;
    
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay => DateUtils.isSameDay(selectedDay, day))
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    
    this.setState({ selectedDays: selectedDays, dayChangeFlag: true, overallChangeFlag: true })
  }
  
  handlePeriodDetailChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, overallChangeFlag: true, variant: '', formErrorMsg: '' });
  }

  trimInputValue = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  validateForm = () => {
    const { periodName, description, selectedDays } = this.state

    if (periodName === '' || description === '' || selectedDays.length === 0) { 
      const text = "One or more input fields are not completed in the form. Please complete all fields with asterisk (*) in the form in order to save."
      this.setState({ variant: 'danger', formErrorMsg: text })
      return false
    }
    else {
      return true
    }
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
    history.push(this.PAGE_PARENT)
  }
  
  dateModalClose = () => {
    this.setState({ dateModalShow: false, variant: '', formErrorMsg: '' })
  }
  
  savePeriod = () => {
    
    const convertedDays = this.state.selectedDays
    .map(selectedDay => new Date(selectedDay).toLocaleDateString());

    if (this.validateForm() === true){
      
      if (this.state.periodId === ''){
    
        const period = {
          periodName: this.state.periodName,
          status: this.state.status,
          description: this.state.description
        }

        callAddPeriodAPI(period, convertedDays)
        .then(
          data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent1: data }),
          error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent1: error.message })
        )
        .catch(err => console.log("Fail to call API due to: " + err))
      }
      else {
        
        const period = {
          periodId: this.state.periodId,
          periodName: this.state.periodName,
          status: this.state.status,
          description: this.state.description
        }

        if (this.state.dayChangeFlag === false){
          callUpdatePeriodDtlAPI(period)
          .then(
            data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent1: data }),
            error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent1: error.message })
          )
          .catch(err => console.log("Fail to call API due to: " + err))
        }
        else {
          callUpdatePeriodWholeAPI(period, convertedDays)
          .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent1: data[0], msgModalContent2: data[1] }))
          .catch(err => console.log("Fail to call API due to: " + err))
        }
      } 
    }
    
  }

  componentDidMount(){
    window.scrollTo(0, 0);
    
    if (this.state.periodId !== ''){
      callGetPeriodDateAPI(this.state.periodId)
      .then(
        data => {
          let result = []
          data.map(dateList => result.push(new Date(dateList.predefineddate)) )
          this.setState({ selectedDays: result })
        },
        error => this.setState({ selectedDays: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent1: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
    }

  }

  render() {
    
    return (
        
      <Container className="pa2">
        
        <h1>Maintain Period</h1>

        <Row>
          <Col className="tr">
            <Button className="ma1" bsPrefix="btn-custom" onClick={ this.savePeriod } disabled={ !this.state.overallChangeFlag }>
              Save
            </Button> 
            <Button className="ma1" bsPrefix="btn-custom" onClick={ ()=>history.push(this.PAGE_PARENT) }>  
              Cancel
            </Button> 
          </Col>
        </Row>
        
        <Alert className="mt2 mb2" variant={ this.state.variant }>{ this.state.formErrorMsg }</Alert>

        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formPeriodName">
              <Form.Label>Period Name *</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter period name" 
                name="periodName" 
                value={ this.state.periodName } 
                onChange={ this.handlePeriodDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formPeriodStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control 
                as="select" 
                name="status"
                value={ this.state.status }
                onChange={ this.handlePeriodDetailChange }
              >
                <option value="A">Active</option>
                <option value="I">Inactive</option>
              </Form.Control>
            </Form.Group>

          </Form.Row>

          <Form.Group controlId="formPeriodDescr">
            <Form.Label>Description *</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter period description" 
              name="description"
              value={ this.state.description } 
              onChange={ this.handlePeriodDetailChange }
              onBlur={ this.trimInputValue }
            />
          </Form.Group>

          <Modal show={ this.state.dateModalShow } onHide={ this.dateModalClose }>
            <Modal.Header closeButton><h4>Select Dates</h4></Modal.Header>
            <Modal.Body className="tc">
              <DayPicker 
                selectedDays={ this.state.selectedDays }
                onDayClick={ this.handleDayClick }
              />
            </Modal.Body>
            <Modal.Footer>
              <Button bsPrefix="btn-custom" onClick={ this.dateModalClose }>OK</Button>
            </Modal.Footer>
          </Modal>
            
          <Form.Row>
            <Col>Selected dates *</Col>
            <Col className="tr">
              <Button 
                bsPrefix="btn-custom"
                onClick={ ()=>this.setState({ dateModalShow: true }) }
              >
                Select dates
              </Button>
            </Col>
          </Form.Row>
            
          <Form.Row>
          {
            this.state.selectedDays.length > 0 &&
            this.state.selectedDays.map((day, i) => {
              return (
                <ListGroup key={ i }>
                  <ListGroup.Item className="ma1 link dim black mw5 dt hide-child ba b--black-20 pa4 br2 pointer">
                    { day.toLocaleDateString() }
                  </ListGroup.Item>
                </ListGroup>
              )
            })
          }
          </Form.Row>         

        </Form>

        <MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent1 }
          contentText2={ this.state.msgModalContent2 }
        />

      </Container>
    );
  }
  
}
 
export default PeriodDtl;