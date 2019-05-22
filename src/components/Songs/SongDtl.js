import React, { Component } from "react";
import { Form, Col, Button, Container } from "react-bootstrap";
import MessageModal from "../MessageModal";

class SongDtl extends Component {

  constructor(props){
    super(props);
    const song = this.props.location.state;
    window.scrollTo(0, 0);
    if (typeof song === 'undefined') {
      this.state = {
        songid: '',
        songname: '',
        songlanguage: '',
        songkey: '',
        songtype: '',
        composer: '',
        musicby: '',
        lyricby: '',
        url1: '',
        url2: '',
        schedulingflag: false,
        lyric: '',
        modalShow: false, 
        modalMsg: '',
        modalHdr: '',
      }
    }
    else {
      this.state = {
        songid: song.id,
        songname: song.songname,
        songlanguage: song.songlanguage,
        songkey: song.songkey,
        songtype: song.songtype,
        composer: song.composer,
        musicby: song.musicby,
        lyricby: song.lyricby,
        url1: song.url1,
        url2: song.url2,
        schedulingflag: song.schedulingflag,
        lyric: song.lyric,
        modalShow: false, 
        modalMsg: '',
        modalHdr: '',
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleChecked = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  formatInput = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  modalClose = () => this.props.history.push('/SongLP')

  saveSong = () => {
    
    if (this.state.songid === ''){
      
      fetch('http://localhost:3001/addsong', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        songname: this.state.songname,
        songlanguage: this.state.songlanguage,
        songkey: this.state.songkey,
        songtype: this.state.songtype,
        composer: this.state.composer,
        musicby: this.state.musicby,
        lyricby: this.state.lyricby,
        url1: this.state.url1,
        url2: this.state.url2,
        schedulingflag: this.state.schedulingflag,
        lyric: this.state.lyric
      })
    })
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Information', modalMsg: data }))
        }
        else { 
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
        }})
      .catch(console.log)
    }
    else {
      
      fetch('http://localhost:3001/updatesong', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        songid: this.state.songid,
        songname: this.state.songname,
        songlanguage: this.state.songlanguage,
        songkey: this.state.songkey,
        songtype: this.state.songtype,
        composer: this.state.composer,
        musicby: this.state.musicby,
        lyricby: this.state.lyricby,
        url1: this.state.url1,
        url2: this.state.url2,
        schedulingflag: this.state.schedulingflag,
        lyric: this.state.lyric
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ modalShow: true , modalHdr: 'Information', modalMsg: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
      }
    }) 
    .catch(console.log)
    }  
    
  }

  render() {
      
      return (
        
        <Container className="pa2">
          
          <h1>Maintain Song</h1>
          
          <Form className="pa2">
          
            <Form.Row>
              <Col className="tr">
                <Button className="ma1" onClick={ this.saveSong }>  
                  Save
                </Button> 
                <Button className="ma1" onClick={ ()=>this.props.history.push('/SongLP') }>  
                  Cancel
                </Button> 
              </Col>
            </Form.Row>

            <Form.Group controlId="formSongName">
              <Form.Label>Song Name *</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter song name" 
                name="songname"
                value={ this.state.songname } 
                onChange={ this.handleChange }
                onBlur={ this.formatInput }
              />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formLanguage">
                <Form.Label>Language *</Form.Label>
                <Form.Control 
                  required
                  as="select" 
                  name="songlanguage" 
                  value={ this.state.songlanguage } 
                  onChange={ this.handleChange }
                >
                  <option value="">Choose...</option>
                  <option value="BIND">Bahasa Indonesia</option>
                  <option value="BJAW">Bahasa Jawa</option>
                  <option value="BBAT">Bahasa Batak</option>
                  <option value="ENGL">English</option>
                  <option value="CHIN">Chinese</option>
                  <option value="JAPN">Japanese</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formSongType">
                <Form.Label>Type *</Form.Label>
                <Form.Control 
                  required
                  as="select" 
                  name="songtype"
                  value={ this.state.songtype } 
                  onChange={ this.handleChange }
                >
                  <option value="">Choose...</option>
                  <option value="Worship">Worship</option>
                  <option value="Praise">Praise</option>
                  <option value="Hymn">Hymn</option>
                  <option value="Sermon Intro">Sermon Intro</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formKeySignature">
                <Form.Label>Key</Form.Label>
                <Form.Control 
                  as="select" 
                  name="songkey"
                  value={ this.state.songkey } 
                  onChange={ this.handleChange }
                >
                  <option value="">Choose...</option>
                  <option value="C">C</option>
                  <option value="C#">C#</option>
                  <option value="D">D</option>
                  <option value="Eb">Eb</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="F#">F#</option>
                  <option value="G">G</option>
                  <option value="Ab">Ab</option>
                  <option value="A">A</option>
                  <option value="Bb">Bb</option>
                  <option value="B">B</option>
                </Form.Control>
              </Form.Group>

            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formComposer">
                <Form.Label>Composer</Form.Label>
                <Form.Control 
                  name="composer"
                  value={ this.state.composer } 
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formMusicBy">
                <Form.Label>Music By</Form.Label>
                <Form.Control 
                  name="musicby"
                  value={ this.state.musicby } 
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formLyricBy">
                <Form.Label>Lyric By</Form.Label>
                <Form.Control 
                  name="lyricby"
                  value={ this.state.lyricby } 
                  onChange={ this.handleChange }
                  onBlur={ this.formatInput }
                />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formUrl1">
              <Form.Label>URL 1</Form.Label>
              <Form.Control 
                name="url1"
                placeholder="https://youtube.com/xxx" 
                value={ this.state.url1 } 
                onChange={ this.handleChange }
                onBlur={ this.formatInput }
              />
            </Form.Group>

            <Form.Group controlId="formUrl2">
              <Form.Label>URL 2</Form.Label>
              <Form.Control 
                placeholder="https://open.spotify.com/xxx" 
                name="url2"            
                value={ this.state.url2 } 
                onChange={ this.handleChange } 
                onBlur={ this.formatInput }
              />
            </Form.Group>

            <Form.Group id="formGridCheckbox">
              <Form.Check 
                label="Available for Scheduling"
                name="schedulingflag"          
                checked={ this.state.schedulingflag }
                onChange={ this.handleChecked }
              />
            </Form.Group>

            <Form.Group controlId="formLyrics">
              <Form.Label>Lyrics</Form.Label>
              <Form.Control 
                as="textarea" 
                name="lyric"
                rows="10"            
                value={ this.state.lyric } 
                onChange={ this.handleChange } 
                onBlur={ this.formatInput }
              />
            </Form.Group>

          </Form>

          <MessageModal
            show={ this.state.modalShow }
            onHide={ this.modalClose }
            header={ this.state.modalHdr }
            errmsg={ this.state.modalMsg }
          />

        </Container>
    );
  }
}
 
export default SongDtl;