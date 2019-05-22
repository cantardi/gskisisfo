import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from "react-bootstrap";

class ServantSearch extends Component {
  
	handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.searchServant();
    }
  }
  
	render(){
    return (
			<Container className="ma2">
				<Form>
					<Form.Group as={Row} controlId="formServantName">
						<Form.Label column md={3}>Servant Name</Form.Label>
						<Col md={6}>
							<Form.Control 
								placeholder="Servant Name" 
								value={ this.props.name } 
								onChange={ this.props.onNameChange } 
								onKeyPress={ this.handleKeyPress } 
							/>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formServantEmail">
						<Form.Label column md={3}>Servant Email</Form.Label>
						<Col md={6}>
							<Form.Control 
								placeholder="Servant Email" 
								value={ this.props.email } 
								onChange={ this.props.onEmailChange } 
								onKeyPress={ this.handleKeyPress } 
							/>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formServantMobile1">
						<Form.Label column md={3}>Servant Mobile 1</Form.Label>
						<Col md={6}>
							<Form.Control 
								placeholder="Servant Mobile 1" 
								value={ this.props.mobile } 
								onChange={ this.props.onMobileChange } 
								onKeyPress={ this.handleKeyPress }
							/>
						</Col>
					</Form.Group>

					<Button className="ma1" onClick={ this.props.searchServant }>Search</Button>
					<Button className="ma1" onClick={ this.props.clearSearch }>Clear</Button>

				</Form>
			</Container>   
    )      
  }
}

export default ServantSearch;