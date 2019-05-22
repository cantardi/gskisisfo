import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from "react-bootstrap";

class PeriodSearch extends Component {
	
	handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.searchPeriod();
    }
	}
	
	render(){
		return (
			<Container className="ma2">
				<Form>
					<Form.Group as={Row} controlId="formPeriodName">
						<Form.Label column md={3}>Period Name</Form.Label>
						<Col md={6}>
							<Form.Control placeholder="Period Name" 
														value={ this.props.periodName } 
														onChange={this.props.onPeriodChange} 
														onKeyPress={this.handleKeyPress} />
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formPeriodStatus">
						<Form.Label column md={3}>Period Status</Form.Label>
						<Col md={6}>
							<Form.Control as="select"  
														value={ this.props.periodStatus } 
														onChange={this.props.onPeriodStatusChange} 
														onKeyPress={this.handleKeyPress}>
								<option value="A">Active</option>
								<option value="I">Inactive</option>
							</Form.Control>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formPeriodDescription">
						<Form.Label column md={3}>Period Description</Form.Label>
						<Col md={6}>
							<Form.Control placeholder="Period Description" 
														value={ this.props.description } 
														onChange={this.props.onDescriptionChange} 
														onKeyPress={this.handleKeyPress}/>
						</Col>
					</Form.Group>

					<Button className="ma1" onClick={this.props.searchPeriod}>Search</Button>
					<Button className="ma1" onClick={this.props.clearSearch}>Clear</Button>

				</Form>
			</Container>					
		);
	}
	
}

export default PeriodSearch;