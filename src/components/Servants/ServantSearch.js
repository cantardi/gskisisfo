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
								name="searchServantName"
								value={ this.props.servantName } 
								onChange={ this.props.handleChange } 
								onKeyPress={ this.handleKeyPress } 
							/>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formServantEmail">
						<Form.Label column md={3}>Servant Email</Form.Label>
						<Col md={6}>
							<Form.Control 
								placeholder="Servant Email" 
								name="searchServantEmail"
								value={ this.props.servantEmail } 
								onChange={ this.props.handleChange } 
								onKeyPress={ this.handleKeyPress } 
							/>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formServantMobile1">
						<Form.Label column md={3}>Servant Mobile 1</Form.Label>
						<Col md={6}>
							<Form.Control 
								placeholder="Servant Mobile 1"
								name="searchServantMobile"
								value={ this.props.servantMobile } 
								onChange={ this.props.handleChange } 
								onKeyPress={ this.handleKeyPress }
							/>
						</Col>
					</Form.Group>

					<Button bsPrefix="btn-custom" className="ma1" onClick={ this.props.searchServant }>Search</Button>
					<Button bsPrefix="btn-custom" className="ma1" onClick={ this.props.clearSearch }>Clear</Button>

				</Form>
			</Container>   
		)      
		
	}
	
}

export default ServantSearch;