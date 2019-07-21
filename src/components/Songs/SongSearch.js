import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';

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
							<Form.Control 
								placeholder="Song Name" 
								name="searchSongName"
								value={ this.props.songName } 
								onChange={ this.props.handleChange } 
								onKeyPress={ this.handleKeyPress }
							/>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formSongType">
						<Form.Label column md={3}>Song Type</Form.Label>
						<Col md={6}>
							<Form.Control 
								as="select" 
								name="searchSongType"
								value={ this.props.songType } 
								onChange={ this.props.handleChange } 
								onKeyPress={ this.handleKeyPress } 
							>
								<option value="">All</option>
								<option value="Worship">Worship</option>
								<option value="Praise">Praise</option>
								<option value="Hymn">Hymn</option>
								<option value="Sermon">Sermon Intro</option>
							</Form.Control>
						</Col>
					</Form.Group>

					<Form.Group as={Row} controlId="formSongComposer">
						<Form.Label column md={3}>Song Composer</Form.Label>
						<Col md={6}>
							<Form.Control 
								placeholder="Song Composer" 
								name="searchComposer"
								value={ this.props.songComposer } 
								onChange={ this.props.handleChange } 
								onKeyPress={ this.handleKeyPress }
							/>
						</Col>
					</Form.Group>

					<Button className="ma1" onClick={ this.props.searchSong }>Search</Button>
					<Button className="ma1" onClick={ this.props.clearSearch }>Clear</Button>

				</Form>
			</Container>					
		);
	}
	
}

export default SongSearch;