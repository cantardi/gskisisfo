import React, { Component } from 'react';
import { Form, Col, Row, Button, Alert, Container } from 'react-bootstrap';
import MessageModal from '../MessageModal';

class SongDtl extends Component {

  constructor(props){
    super(props);
    const song = this.props.location.state;

    window.scrollTo(0, 0);
    this.PAGE_PARENT = './SongLP'
    
    if (typeof song === 'undefined') {
      this.state = {
        songlanglists: [],
        songtypelists: [],
        songkeylists: [],
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
        variant: '',
        formErrorMsg: '',
        msgModalShow: false, 
        msgModalContent: '',
        msgModalHeader: '',
      }
    }
    else {
      this.state = {
        songlanglists: [],
        songtypelists: [],
        songkeylists: [],
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
        variant: '',
        formErrorMsg: '',
        msgModalShow: false, 
        msgModalContent: '',
        msgModalHeader: '',
      }
    }
  }

  handleSongDetailChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleChecked = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  trimInputValue = (e) => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  validateForm = () => {
    const { songname, songlanguage, songtype } = this.state

    if (songname === '' || songlanguage === '' || songtype === '') { 
      const text = "One or more input fields are not completed in the form. Please complete all fields with asterisk (*) in the form in order to save."
      this.setState({ variant: 'danger', formErrorMsg: text })
    }
    else {
      this.setState({ variant: '', formErrorMsg: '' })
      return true
    }
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
    this.props.history.push(this.PAGE_PARENT)
  }

  callGetMasterFieldValuesAPI = () => {
    
    Promise.all([
      fetch(process.env.REACT_APP_BACKEND_URL + '/getfieldvalues/Song Language', {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
      }),
      fetch(process.env.REACT_APP_BACKEND_URL + '/getfieldvalues/Song Type', {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
      }),
      fetch(process.env.REACT_APP_BACKEND_URL + '/getfieldvalues/Song Key', {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
      })
    ])
    .then (async([songlangresp, songtyperesp, songkeyresp]) => {
      const songlangdata = await songlangresp.json()
      const songtypedata = await songtyperesp.json()
      const songkeydata = await songkeyresp.json()
      return [songlangdata, songtypedata, songkeydata]
    }) 
    .then(data => this.setState({ songlanglists: data[0], songtypelists: data[1], songkeylists: data[2] }))
    .catch(err => console.log('Fail to call getfieldvalues API: ' + err)) 
    
  }

  callAddSongAPI = () => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/addsong', {
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
    .then(response => response.json())
    .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))     
    .catch(err => console.log('Fail to call insertsong API: ' + err))

  }

  callUpdateSongAPI = () => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/updatesong', {
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
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call updatesong API: ' + err))

  }

  saveSong = () => {
    
    if (this.validateForm() === true){
      if (this.state.songid === ''){
        this.callAddSongAPI();
      }
      else {
        this.callUpdateSongAPI();
      }  
    }
    
  }

  componentDidMount() {
    this.callGetMasterFieldValuesAPI();
  }
  
  render() {
    
    return (

      <Container className="pa2">
          
        <h1>Maintain Song</h1>

        <Row>
          <Col className="tr">
            <Button className="ma1" onClick={ this.saveSong }>
              Save
            </Button> 
            <Button className="ma1" onClick={ ()=>this.props.history.push(this.PAGE_PARENT) }>  
              Cancel
            </Button> 
          </Col>
        </Row>

        <Alert className="mt2 mb2" variant={ this.state.variant }>{ this.state.formErrorMsg }</Alert>

        <Form>
          
          <Form.Group controlId="formSongName">
            <Form.Label>Song Name *</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter song name" 
              name="songname"
              value={ this.state.songname } 
              onChange={ this.handleSongDetailChange }
              onBlur={ this.trimInputValue }
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
                onChange={ this.handleSongDetailChange }
              >
                <option value="">Choose...</option>
                {
                  this.state.songlanglists.length > 0 &&
                  this.state.songlanglists.map(songlang => {
                    return (
                      <option key={ songlang.id } value={ songlang.id }>{ songlang.description }</option> 
                    )
                  })
                }
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formSongType">
              <Form.Label>Type *</Form.Label>
              <Form.Control 
                required
                as="select" 
                name="songtype"
                value={ this.state.songtype } 
                onChange={ this.handleSongDetailChange }
              >
                <option value="">Choose...</option>
                {
                  this.state.songtypelists.length > 0 &&
                  this.state.songtypelists.map(songtype => {
                    return (
                      <option key={ songtype.id } value={ songtype.id }>{ songtype.description }</option> 
                    )
                  })
                }
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formKeySignature">
              <Form.Label>Key</Form.Label>
              <Form.Control 
                as="select" 
                name="songkey"
                value={ this.state.songkey } 
                onChange={ this.handleSongDetailChange }
              >
                <option value="">Choose...</option>
                {
                  this.state.songkeylists.length > 0 &&
                  this.state.songkeylists.map(songkey => {
                    return (
                      <option key={ songkey.id } value={ songkey.id }>{ songkey.description }</option> 
                    )
                  })
                }
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formComposer">
              <Form.Label>Composer</Form.Label>
              <Form.Control 
                name="composer"
                value={ this.state.composer } 
                onChange={ this.handleSongDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formMusicBy">
              <Form.Label>Music By</Form.Label>
              <Form.Control 
                name="musicby"
                value={ this.state.musicby } 
                onChange={ this.handleSongDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formLyricBy">
              <Form.Label>Lyric By</Form.Label>
              <Form.Control 
                name="lyricby"
                value={ this.state.lyricby } 
                onChange={ this.handleSongDetailChange }
                onBlur={ this.trimInputValue }
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formUrl1">
            <Form.Label>URL 1</Form.Label>
            <Form.Control 
              name="url1"
              placeholder="https://youtube.com/xxx" 
              value={ this.state.url1 } 
              onChange={ this.handleSongDetailChange }
              onBlur={ this.trimInputValue }
            />
          </Form.Group>

          <Form.Group controlId="formUrl2">
            <Form.Label>URL 2</Form.Label>
            <Form.Control 
              placeholder="https://open.spotify.com/xxx" 
              name="url2"            
              value={ this.state.url2 } 
              onChange={ this.handleSongDetailChange } 
              onBlur={ this.trimInputValue }
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
              onChange={ this.handleSongDetailChange } 
              onBlur={ this.trimInputValue }
            />
          </Form.Group>
        </Form>

        <MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent }
        />
      </Container>
    );
  }

}
 
export default SongDtl;