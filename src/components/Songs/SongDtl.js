import React, { Component } from "react";
import { Form, Col, Button, Container } from "react-bootstrap";

class SongDtl extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      type: '',
      composer: '',
      musicby: ''
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  saveSong = () => {
    let newSong = {
      name: this.state.name,
      type: this.state.type,
      composer: this.state.composer,
      musicby: this.state.musicby
    }
    this.setState({ newSong })
    alert('Name: ' + newSong.name + '\nType: ' + newSong.type + "\nComposer: " + newSong.composer + "\nMusicby: " + newSong.musicby);
    this.props.history.push('/SongLP');
  }

  render() {
      return (
        
        <Container className="pa2">
          
          <h1>New Song</h1>

          <Form className="pa2">
            
            <Form.Group controlId="formSongName">
              <Form.Label>Song Name</Form.Label>
              <Form.Control placeholder="Enter song name" name='name' value={this.state.name} onChange={this.handleChange}/>
              </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formLanguage">
                <Form.Label>Language</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>Bahasa Indonesia</option>
                  <option>Bahasa Jawa</option>
                  <option>Bahasa Batak</option>
                  <option>English</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formKeySignature">
                <Form.Label>Key</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>C</option>
                  <option>C#</option>
                  <option>D</option>
                  <option>Eb</option>
                  <option>E</option>
                  <option>F</option>
                  <option>F#</option>
                  <option>G</option>
                  <option>G#</option>
                  <option>A</option>
                  <option>Bb</option>
                  <option>B</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formSongType">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" name='type' value={this.state.type} onChange={this.handleChange}>
                  <option>Choose...</option>
                  <option>Worship</option>
                  <option>Praise</option>
                  <option>Hymn</option>
                  <option>Sermon Intro</option>
                </Form.Control>
              </Form.Group>

            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formComposer">
                <Form.Label>Composer</Form.Label>
                <Form.Control name='composer' value={this.state.composer} onChange={this.handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="formMusicBy">
                <Form.Label>Music By</Form.Label>
                <Form.Control name='musicby' value={this.state.musicby} onChange={this.handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formLyricBy">
                <Form.Label>Lyric By</Form.Label>
                <Form.Control />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formUrl1">
              <Form.Label>URL 1</Form.Label>
              <Form.Control placeholder="https://youtube.com/xxx" />
            </Form.Group>

            <Form.Group controlId="formUrl2">
              <Form.Label>URL 2</Form.Label>
              <Form.Control placeholder="https://open.spotify.com/xxx" />
            </Form.Group>

            <Form.Group id="formGridCheckbox">
              <Form.Check type="checkbox" label="Available for Scheduling" />
            </Form.Group>

            <Form.Group controlId="formLyrics">
              <Form.Label>Lyrics</Form.Label>
              <Form.Control as="textarea" rows="10"/>
            </Form.Group>

            <Button onClick={this.saveSong}>  
              Save
            </Button> 

          </Form>

        </Container>
    );
  }
}
 
export default SongDtl;