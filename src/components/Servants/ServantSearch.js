import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from "react-bootstrap";

class ServantSearch extends Component {
	render(){
    return (
      <Container className="ma2">
        <Form>
          <Form.Group as={Row} controlId="formServantName">
            <Form.Label column md={3}>Servant Name</Form.Label>
            <Col md={6}>
              <Form.Control id="formServantName" placeholder="Servant Name" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formServantEmail">
            <Form.Label column md={3}>Servant Email</Form.Label>
            <Col md={6}>
              <Form.Control id="formServantEmail" placeholder="Servant Email" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formServantMobile">
            <Form.Label column md={3}>Servant Mobile</Form.Label>
            <Col md={6}>
              <Form.Control id="formServantMobile" placeholder="Servant Mobile" />
            </Col>
          </Form.Group>
                  
          <Button className="ma1" onClick={this.props.searchServant}>Search</Button>
          <Button className="ma1">Clear</Button>

        </Form>
      </Container>      
    )      
  }
}

export default ServantSearch;