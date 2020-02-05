import React, { Component } from 'react';
import { Form, Col, Row, Button, Alert, Container } from 'react-bootstrap';
import { callGetMasterFieldValuesAPI, callAddSongAPI, callUpdateSongAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function'
import MessageModal from '../MessageModal';

class SongDtl extends Component {

  constructor(props){
    super(props);
    const song = this.props.location.state;

    this.PAGE_PARENT = 'SongLP'
    
    if (typeof song === 'undefined') {
      this.state = {
        songLangLists: [],
        songTypeLists: [],
        songKeyLists: [],
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
        overallChangeFlag: false
      }
    }
    else {
      this.state = {
        songLangLists: [],
        songTypeLists: [],
        songKeyLists: [],
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
        overallChangeFlag: false
      }
    }
  }

  handleSongDetailChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, overallChangeFlag: true, variant: '', formErrorMsg: '' });
  }
  
  handleChecked = (e) => {
    this.setState({ [e.target.name]: e.target.checked, overallChangeFlag: true, variant: '', formErrorMsg: '' });
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
    history.push(this.PAGE_PARENT)
  }

  saveSong = () => {
    
    const songObj = {
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
    }

    if (this.validateForm() === true){
      if (this.state.songid === ''){
        callAddSongAPI(songObj)
        .then(
          data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }),
          error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error })
        )
        .catch(err => console.log("Fail to call API due to: " + err))
      }
      else {
        callUpdateSongAPI(songObj, this.state.songid)
        .then(
          data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }),
          error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error })
        )
        .catch(err => console.log("Fail to call API due to: " + err))
      }  
    }
    
  }

  componentDidMount() {

    window.scrollTo(0, 0);

    Promise.all([
      callGetMasterFieldValuesAPI('Song Language'),
      callGetMasterFieldValuesAPI('Song Type'), 
      callGetMasterFieldValuesAPI('Song Key'), 
    ])
    .then(
      data => this.setState({ songLangLists: data[0], songTypeLists: data[1], songKeyLists: data[2] }),
      //error => this.setState({ genderLists: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
    
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
            <Button className="ma1" onClick={ ()=>history.push(this.PAGE_PARENT) }>  
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
                  this.state.songLangLists.length > 0 &&
                  this.state.songLangLists.map(songLang => {
                    return (
                      <option key={ songLang.id } value={ songLang.id }>{ songLang.description }</option> 
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
                  this.state.songTypeLists.length > 0 &&
                  this.state.songTypeLists.map(songtype => {
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
                  this.state.songKeyLists.length > 0 &&
                  this.state.songKeyLists.map(songkey => {
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