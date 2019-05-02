import React, { Component } from "react";
import { Form, Col, Button, Container } from "react-bootstrap";

class ServantDtl extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      mobile: '',
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  savePerson = () => {
    let newPerson = {
      name: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
    }
    this.setState({ newPerson })
    alert('Name: ' + newPerson.name + '\nEmail: ' + newPerson.email + "\nMobile: " + newPerson.mobile);
    this.props.history.push('/ServantLP');
  }

  render() {
      return (

        <Container className="pa2">

          <Form>
            
            <Form.Group controlId="formPersonName">
              <Form.Label>Person Name</Form.Label>
              <Form.Control placeholder="Enter person name" name='name' value={this.state.name} onChange={this.handleChange}/>
              </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control name='email' value={this.state.email} onChange={this.handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formMobile1">
                <Form.Label>Mobile 1</Form.Label>
                <Form.Control name='mobile' value={this.state.mobile} onChange={this.handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formMobile2">
                <Form.Label>Mobile 2</Form.Label>
                <Form.Control />
              </Form.Group>
            </Form.Row>

            <Form.Group id="formGridCheckbox">
              <Form.Check type="checkbox" label="Available for Scheduling" />
            </Form.Group>

            <Button onClick={this.savePerson}>
               Save
            </Button> 

          </Form>
        </Container>
    );
  }
}
 
export default ServantDtl;