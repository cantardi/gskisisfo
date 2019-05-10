import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from "react-bootstrap";

class SongSearch extends Component {

	handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.searchSong();
    }
	}
	
	render(){
		return (
			<Container className="ma2">
				<Form>
					<Form.Group as={Row} controlId="formSongName">
						<Form.Label column md={3}>Song Name</Form.Label>
						<Col md={6}>
							<Form.Control placeholder="Song Name" 
														value={ this.props.songName } 
														onChange={this.props.onNameChange} 
														onKeyPress={this.handleKeyPress}/>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formSongType">
						<Form.Label column md={3}>Song Type</Form.Label>
						<Col md={6}>
							<Form.Control as="select" 
														value={ this.props.songType } 
														onChange={this.props.onTypeChange} 
														onKeyPress={this.handleKeyPress}>
								<option value=''>All</option>
								<option value='Worship'>Worship</option>
								<option value='Praise'>Praise</option>
								<option value='Hymn'>Hymn</option>
								<option value='Sermon'>Sermon Intro</option>
							</Form.Control>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formSongComposer">
						<Form.Label column md={3}>Song Composer</Form.Label>
						<Col md={6}>
							<Form.Control placeholder="Song Composer" 
														value={ this.props.songComposer } 
														onChange={this.props.onComposerChange} 
														onKeyPress={this.handleKeyPress}/>
						</Col>
					</Form.Group>

					<Button className="ma1" onClick={this.props.searchSong}>Search</Button>
					<Button className="ma1" onClick={this.props.clearSearch}>Clear</Button>

				</Form>
			</Container>					
		);
	}
}

export default SongSearch;