import React, { Component } from 'react';
import { Container, Form, Col } from 'react-bootstrap';

class ServiceSermon extends Component {

	render(){
    
		return (
			<Container>
        
        <Form>

          <Form.Row>
            <Form.Group as={Col} controlId="formSermonTitle">
              <Form.Label>Sermon Title</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter sermon title" 
                name="sermontitle" 
                value={ this.props.sermontitle } 
                onChange={ this.props.handleSermonDetailChange }
                onBlur={ this.props.trimInputValue }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formPreacherName">
              <Form.Label>Preacher Name</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter preacher name" 
                name="preachername" 
                value={ this.props.preachername } 
                onChange={ this.props.handleSermonDetailChange }
                onBlur={ this.props.trimInputValue }
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formBibleExcerpts">
            <Form.Label>Sermon Bible Excerpts</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter Bible Excerpts" 
              name="excerpts"
              value={ this.props.bibleexcerpts } 
              onChange={ this.props.handleSermonDetailChange }
              onBlur={ this.props.trimInputValue }
            />
          </Form.Group>

          <Form.Group controlId="formSermonSummary">
            <Form.Label>Sermon Summary</Form.Label>
            <Form.Control 
              as="textarea" 
              name="summary"
              rows="10"            
              value={ this.props.summary } 
              onChange={ this.props.handleSermonDetailChange } 
              onBlur={ this.props.trimInputValue }
            />
          </Form.Group>

        </Form>

			</Container>					
		);
	}
	
}

export default ServiceSermon;