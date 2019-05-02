import React, { Component } from "react";
import { Form, Col, Button, Container } from "react-bootstrap";

class PeriodDtl extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      status: 'Active',
      description: '',
    }
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
      return (
        
        <Container className="pa2">
          
          <h1>New Period</h1>

          <Form className="pa2">

            <Form.Row>

              <Form.Group as={Col} controlId="formPeriodName">
                <Form.Label>Period Name</Form.Label>
                <Form.Control placeholder="Enter Period name" name='name' value={this.state.name} onChange={this.handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="formPeriodStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name='status' value={this.state.status} onChange={this.handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </Form.Control>
              </Form.Group>

            </Form.Row>

            <Form.Group controlId="formPeriodDescr">
              <Form.Label>Description</Form.Label>
              <Form.Control placeholder="Enter Period name" name='description' value={this.state.description} onChange={this.handleChange}/>
            </Form.Group>

            <Button onClick={this.savePeriod}>  
              Save
            </Button> 

          </Form>

        </Container>
    );
  }
}
 
export default PeriodDtl;