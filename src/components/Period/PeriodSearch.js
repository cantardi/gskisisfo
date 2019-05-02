import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from "react-bootstrap";

class PeriodSearch extends Component {
	render(){
		return (
			<Container className="ma2">
				<Form>
					<Form.Group as={Row} controlId="formPeriodName">
						<Form.Label column md={3}>Period Name</Form.Label>
						<Col md={6}>
							<Form.Control id="formPeriodName" placeholder="Period Name" />
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formPeriodStatus">
						<Form.Label column md={3}>Period Status</Form.Label>
						<Col md={6}>
							<Form.Control as="select">
								<option>Active</option>
								<option>Inactive</option>
							</Form.Control>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formPeriodDescription">
						<Form.Label column md={3}>Period Description</Form.Label>
						<Col md={6}>
							<Form.Control placeholder="Period Description" />
						</Col>
					</Form.Group>

					<Button className="ma1" onClick={this.props.searchPeriod}>Search</Button>
					<Button className="ma1">Clear</Button>

				</Form>
			</Container>					
		);
	}
}

export default PeriodSearch;