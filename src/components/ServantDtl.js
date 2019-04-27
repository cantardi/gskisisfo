import React, { Component } from "react";
import { Form, Col, Button } from "react-bootstrap";

class ServantDtl extends Component {
  render() {
      return (

        <div className='container'>

          <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"/>

          <Form>
            
            <Form.Group controlId="formPersonName">
              <Form.Label>Person Name</Form.Label>
              <Form.Control placeholder="Enter person name" />
              </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} controlId="formMobile1">
                <Form.Label>Mobile 1</Form.Label>
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} controlId="formMobile2">
                <Form.Label>Mobile 2</Form.Label>
                <Form.Control />
              </Form.Group>
            </Form.Row>

            <Form.Group id="formGridCheckbox">
              <Form.Check type="checkbox" label="Available for Scheduling" />
            </Form.Group>

            <Button variant="primary" type="submit">  
               Submit
            </Button> 

          </Form>
        </div>
    );
  }
}
 
export default ServantDtl;