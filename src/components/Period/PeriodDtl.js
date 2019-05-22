import React, { Component } from "react";
import { Form, Modal, Row, Col, Button, Container, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class PeriodDtl extends Component {

  constructor(props){
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      selectedDays: [],
      selectedPerson: [],
      modalShow: false,
    }
  }
  
  modalClose = () => this.setState({ modalShow: false });
  
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
  
  setUnavailability = () => {
    
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  savePeriod = () => {
    let newPeriod = {
      name: this.state.name,
      status: this.state.status,
      description: this.state.description,
    }
    this.setState({ newPeriod })
    alert('Name: ' + newPeriod.name + '\nStatus: ' + newPeriod.status + "\nDescription: " + newPeriod.description);
    this.props.history.push('/PeriodLP');
  }

  render() {
    const person = ['Ardiansyah', 'Ryan Antonius', 'Eveline Natasya', 'Hanry Chandra', 'Monica Christin']

      return (
        
        <Container className="pa2">
        
          <h1>Maintain Period</h1>

          <Row >
            <Col className="tr">
              <Button className="ma1" onClick={this.savePeriod}>  
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
                <Form.Control placeholder="Enter Period name" 
                              name='name' 
                              value={this.state.name} 
                              onChange={this.handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="formPeriodStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" 
                              name='status' 
                              value={this.state.status} 
                              onChange={this.handleChange}>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                </Form.Control>
              </Form.Group>

            </Form.Row>

            <Form.Group controlId="formPeriodDescr">
              <Form.Label>Description</Form.Label>
              <Form.Control placeholder="Enter Period name" 
                            name='description' 
                            value={this.state.description} 
                            onChange={this.handleChange}/>
            </Form.Group>

            <Modal show={this.state.modalShow} onHide={this.modalClose}>
              <Modal.Header closeButton><h4>Select Dates</h4></Modal.Header>
              <Modal.Body className="tc">
                <DayPicker selectedDays={this.state.selectedDays}
                           onDayClick={this.handleDayClick}/>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.modalClose}>OK</Button>
              </Modal.Footer>
            </Modal>
            
            <Form.Row>
              <Col>Selected dates</Col>
              <Col className="tr">
                <Button variant="primary"
                        onClick={() => this.setState({ modalShow: true })}>
                  Select dates
                </Button>
              </Col>
            </Form.Row>
            
            <Form.Row>
              {this.state.selectedDays.length > 0 &&
                this.state.selectedDays.map((day, i) => {
                  return (
                    <ListGroup>
                      <OverlayTrigger
                        key='bottom'
                        placement='bottom'
                        overlay={
                          <Tooltip id={`tooltip-${i}`}>
                            Click to set unavailability
                          </Tooltip>
                        }>
                        <ListGroup.Item id={ i } 
                                        className="ma1 link dim black mw5 dt hide-child ba b--black-20 pa4 br2 pointer"
                                        onClick={ ()=>this.setUnavailability }>
                         { day.toLocaleDateString() }
                        </ListGroup.Item>
                      </OverlayTrigger>

                    </ListGroup>
                  )
                })
              }
            </Form.Row>         

          </Form>

        </Container>
    );
  }
}
 
export default PeriodDtl;