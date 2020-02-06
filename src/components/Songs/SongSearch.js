import React, { Component } from 'react';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';
import { callGetMasterFieldValuesAPI } from '../../helpers/apicall';

class SongSearch extends Component {

	state = {
		songTypeLists: []
	}

	handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.searchSong();
    }
	}
	
	componentDidMount() {

		callGetMasterFieldValuesAPI('Song Type')
		.then(
      data => this.setState({ songTypeLists: data }),
      error => this.setState({ songTypeLists: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

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
								{
									this.state.songTypeLists.length > 0 &&
									this.state.songTypeLists.map(songtype => {
										return <option key={songtype.id} value={songtype.id}>{songtype.description}</option>	
									})
								}
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

					<Button className="ma1" bsPrefix="btn-custom" onClick={ this.props.searchSong }>Search</Button>
					<Button className="ma1" bsPrefix="btn-custom" onClick={ this.props.clearSearch }>Clear</Button>

				</Form>
			</Container>					
		)

	}
	
}

export default SongSearch;