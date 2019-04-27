import React, { Component } from "react";
import { Form, Col, Button } from "react-bootstrap";

class SongDtl extends Component {
  render() {
      return (

        <div className='container'>

          <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"/>

          <Form>
            
            <Form.Group controlId="formSongName">
              <Form.Label>Song Name</Form.Label>
              <Form.Control placeholder="Enter song name" />
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
                <Form.Control as="select">
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
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} controlId="formMusicBy">
                <Form.Label>Music By</Form.Label>
                <Form.Control />
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

            <Button variant="primary" type="submit">  
               Submit
            </Button> 

          </Form>
        </div>
    );
  }
}
 
export default SongDtl;