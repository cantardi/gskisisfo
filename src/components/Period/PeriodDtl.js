import React, { Component } from "react";
import { Form, Modal, Row, Col, Button, Container, ListGroup } from "react-bootstrap";
import DayPicker, {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MessageModal from '../MessageModal';

class PeriodDtl extends Component {
  
  constructor(props){
    super(props);
    const period = this.props.location.state;
    
    window.scrollTo(0, 0);
    this.PAGE_PARENT = './PeriodLP'

    if (typeof period === 'undefined') {
      this.state = {
        periodid: '',
        periodname: '',
        status: 'A',
        description: '',
        selectedDays: [],
        msgModalShow: false, 
        msgModalContent1: '',
        msgModalContent2: '',
        msgModalHeader: '',
        dateModalShow: false, 
      }
    }
    else {
      this.state = {
        periodid: period.id,
        periodname: period.periodname,
        status: period.status,
        description: period.description,
        selectedDays: [], 
        msgModalShow: false,
        msgModalContent1: '',
        msgModalContent2: '',
        msgModalHeader: '',
        dateModalShow: false,
      }
    }

  }
  
  handleDayClick = (day, { selected }) => {
    const { selectedDays } = this.state;
    
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay => DateUtils.isSameDay(selectedDay, day) )
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    
    this.setState({ selectedDays });
  }
  
  handlePeriodDetailChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  trimInputValue = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
    this.props.history.push('/PeriodLP')
  }
  
  dateModalClose = () => {
    this.setState({ dateModalShow: false })
  }
  
  callGetPeriodDateAPI = (periodid) => {
    
    fetch('https://gskisisfobackend.herokuapp.com/getperioddate/' + periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        var result=[]
        return response.json()
        .then(data => {
          for(var i in data){
            result.push(new Date(data[i].predefineddate))
          }
          this.setState({ selectedDays: result })
        })
      }
      else{
        return response.json()
        .then(data => console.log(data))
      }
    }) 
    .catch(err => console.log('Fail to call getperioddate API: ' + err))

  }

  callAddPeriodAPI = (convertedDays) => {

    fetch('https://gskisisfobackend.herokuapp.com/addperiod', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        periodname: this.state.periodname,
        status: this.state.status,
        description: this.state.description,
        selectedDays: convertedDays
      })
    })
    .then(response => response.json())
    .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent1: data }))     
    .catch(err => console.log('Fail to call addperiod API: ' + err))

  }

  callUpdatePeriodAPI = (convertedDays) => {
    
    Promise.all([
      fetch('https://gskisisfobackend.herokuapp.com/updateperioddtl', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          periodid: this.state.periodid,
          periodname: this.state.periodname,
          status: this.state.status,
          description: this.state.description,
        })
      }),
      fetch('https://gskisisfobackend.herokuapp.com/updateperioddates', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          periodid: this.state.periodid,
          selectedDays: convertedDays
        })
      })
    ])
    .then (async([dtlresponse, dateresponse]) => {
      const dtlData = await dtlresponse.json()
      const dateData = await dateresponse.json()
      return [dtlData, dateData]
    }) 
    .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent1: data[0], msgModalContent2: data[1] }))
    .catch(err => console.log('Fail to call updateperiod API: ' + err)) 
  }

  savePeriod = () => {
    
    if (this.state.periodid === ''){
      const convertedDays =
        this.state.selectedDays.map(selectedDay => new Date(selectedDay).toLocaleDateString());
      this.callAddPeriodAPI(convertedDays);
    }
    else {
      const convertedDays =
        this.state.selectedDays.map(selectedDay => new Date(selectedDay).toLocaleDateString());
      this.callUpdatePeriodAPI(convertedDays); 
    } 

  }

  componentDidMount(){

    if (this.state.periodid !== ''){
      this.callGetPeriodDateAPI(this.state.periodid);
    }

  }

  render() {
      
    return (
        
      <Container className="pa2">
        
        <h1>Maintain Period</h1>

        <Row>
          <Col className="tr">
            <Button className="ma1" onClick={ this.savePeriod }>
              Save
            </Button> 
            <Button className="ma1" onClick={ ()=>this.props.history.push(this.PAGE_PARENT) }>  
              Cancel
            </Button> 
          </Col>
        </Row>
         
        <Form className="pa2">
          <Form.Row>
            <Form.Group as={Col} controlId="formPeriodName">
              <Form.Label>Period Name*</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter period name" 
                name="periodname" 
                value={ this.state.periodname } 
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
            <Form.Label>Description*</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter period description" 
              name="description"
              value={ this.state.description } 
              onChange={ this.handlePeriodDetailChange }
              onBlur={ this.trimInputValue }
            />
            <Form.Control.Feedback>Hello</Form.Control.Feedback>
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
              <Button onClick={ this.dateModalClose }>OK</Button>
            </Modal.Footer>
          </Modal>
            
          <Form.Row>
            <Col>Selected dates</Col>
            <Col className="tr">
              <Button 
                variant="primary"
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