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
    this.handleDayClick = this.handleDayClick.bind(this);
    if (typeof period === 'undefined') {
      this.state = {
        periodid: '',
        periodname: '',
        status: 'A',
        description: '',
        selectedDays: [],
        modalShow: false, 
        dateModalShow: false, 
        modalMsg: '',
        modalHdr: '',
      }
    }
    else {
      this.state = {
        periodid: period.id,
        periodname: period.periodname,
        status: period.status,
        description: period.description,
        selectedDays: [],
        modalShow: false, 
        dateModalShow: false, 
        modalMsg: '',
        modalHdr: '',
      }
    }
  }
  
  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
  }
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  formatInput = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  modalClose = () => this.props.history.push('/PeriodLP')
  
  dateModalClose = () => this.setState({ dateModalShow: false })
  
  savePeriod = () => {
    
    const convertedDays =
      this.state.selectedDays.map(selectedDay => new Date(selectedDay).toLocaleDateString());

    if (this.state.periodid === ''){
      
      fetch('http://localhost:3001/addperiod', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        periodname: this.state.periodname,
        status: this.state.status,
        description: this.state.description,
        selectedDays: convertedDays
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
      
      fetch('http://localhost:3001/updateperiod', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        periodid: this.state.periodid,
        periodname: this.state.periodname,
        status: this.state.status,
        description: this.state.description,
        selectedDays: convertedDays
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

  componentDidMount(){
    if (this.state.periodid !== ''){
      fetch('http://localhost:3001/getperioddate/'+this.state.periodid, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
      })
      .then (response => {
        if (response.status === 200){
          var result=[]
          return response.json()
          .then(data => {
            for(var i in data){
              result.push(new Date(data[i].predefineddate) );
            }
            this.setState({ selectedDays: result })
          })
        
        }
      }) 
      .catch(err => console.log)
    }
  }

  render() {
      console.log(this.state.selectedDays)
      return (
        
        <Container className="pa2">
        
          <h1>Maintain Period</h1>

          <Row >
            <Col className="tr">
              <Button className="ma1" onClick={ this.savePeriod }>
                Save
              </Button> 
              <Button className="ma1" onClick={ ()=>this.props.history.push('/PeriodLP') }>  
                Cancel
              </Button> 
            </Col>
          </Row>
         
          <Form className="pa2">

            <Form.Row>

              <Form.Group as={Col} controlId="formPeriodName">
                <Form.Label>Period Name</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Enter Period name" 
                  name="periodname" 
                  value={ this.state.periodname } 
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formPeriodStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control 
                  as="select" 
                  name="status"
                  value={ this.state.status } 
                  onChange={ this.handleChange }
                >
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                </Form.Control>
              </Form.Group>

            </Form.Row>

            <Form.Group controlId="formPeriodDescr">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter Period Description" 
                name="description"
                value={ this.state.description } 
                onChange={ this.handleChange }
                onBlur={ this.formatInput }
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
                <Button onClick={ this.dateModalClose }>OK</Button>
              </Modal.Footer>
            </Modal>
            
            <Form.Row>
              <Col>Selected dates</Col>
              <Col className="tr">
                <Button variant="primary"
                        onClick={ ()=>this.setState({ dateModalShow: true }) }>
                  Select dates
                </Button>
              </Col>
            </Form.Row>
            
            <Form.Row>
              {this.state.selectedDays.length > 0 &&
                this.state.selectedDays.map((day, i) => {
                  return (
                    <ListGroup key={i}>
                      <ListGroup.Item 
                        className="ma1 link dim black mw5 dt hide-child ba b--black-20 pa4 br2 pointer"
                      >
                         { day.toLocaleDateString() }
                      </ListGroup.Item>
                    </ListGroup>
                  )
                })
              }
            </Form.Row>         

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
 
export default PeriodDtl;