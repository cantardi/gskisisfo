import React, { Component } from "react";
import { Form, Container, Col, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { MdAddCircleOutline, MdVideoLibrary, MdClose } from 'react-icons/md';
import MessageModal from '../MessageModal';
import SongModal from './SongModal';

class SelectSong extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      allperiod: [],
      selectedPeriod: '',
      displayedDates: [],
      selectedDate: '',
      displayedSongs: [],
      selectedSongs: [],
      songModalShow: false,
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
    }
    
  }

  msgModalClose = () => {
    this.props.history.push('/SelfService');
  }

  openSongModal = () => {
    this.setState({ songModalShow: true })
  }

  closeSongModal = () => {
    this.setState({ songModalShow: false })
  }

  handlePeriodChange = (e) => {
    this.setState({ selectedPeriod: e.target.value });
    this.setState({ displayedDates: [] });
    this.setState({ selectedSongs: [] });
    this.setState({ displayedSongs: [] });
    this.callGetPeriodDateAPI(e.target.value);
  }

  handleDateChange = (e) => {
    this.setState({ selectedDate: e.target.value });
    this.setState({ selectedSongs: [] });
    this.setState({ displayedSongs: [] });
    this.callGetSongForSelectionAPI(e.target.value);
  }

  handleKeyChange = (songid, e) => {
    
    const { selectedSongs } = this.state;

    let foundIndex = selectedSongs.findIndex(updatedItem => updatedItem.songid === songid)

    let updatedSong = Object.assign({}, selectedSongs[foundIndex])
    updatedSong.songkey = e.target.value;

    selectedSongs.splice(foundIndex, 1, updatedSong)
    this.setState({ selectedSongs });

  }

  validateSong(song) {
    return this.state.selectedSongs
      .filter(selectedSong => selectedSong.songid===song.songid)
  }

  addSongFromList = (song) => {
    const { selectedSongs } = this.state;
    
    if (this.validateSong(song).length > 0){
      alert('Song already exists')
    }
    else{
      selectedSongs.push(song);
      this.setState({ selectedSongs });
    }
  }

  restructureSong = (song) => {
    return ({
      periodid: Number(this.state.selectedPeriod),
      dateid: Number(this.state.selectedDate),
      songid: song.id,
      songname: song.songname,
      songtype: song.songtype,
      songkey: song.songkey
    })
  }

  addSongOutofList = (song) => {
    const { selectedSongs } = this.state;
    
    const restructuredSong = this.restructureSong(song)

    if (this.validateSong(restructuredSong).length > 0){
      alert('Song already exists')
    }
    else{
      selectedSongs.push(restructuredSong);
      this.setState({ selectedSongs });
    }
  }

  removeSong = (songid) => {
    const { selectedSongs } = this.state;
    
    let newSelectedSongs = selectedSongs.filter(newArray => newArray.songid !== songid )
    this.setState({ selectedSongs: newSelectedSongs });
  }

  openVideo = (videourl) => {
    if (videourl) {
      window.open(videourl, '_blank');
    }
  }

  submitSongSelection = () => {
    if (window.confirm('Are you sure you wish to submit this schedule?')) {
      this.callSaveSongSelectionAPI();
    }
  }

  callGetPeriodAPI = () => {
    fetch('http://localhost:3001/getperiod', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ allperiod: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperiodapi: ' + err))
  }

  callGetPeriodDateAPI = (periodid) => {
    fetch('http://localhost:3001/getperioddate/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ displayedDates: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperioddateapi: ' + err))
  }

  callGetSongForSelectionAPI = (dateid) => {
    fetch('http://localhost:3001/getsongforselection/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ displayedSongs: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getsongforselectionapi: ' + err))
  }

  callSaveSongSelectionAPI = () => {
 
    const selectedSongs = this.state.selectedSongs.map(song => ({
        periodid: song.periodid,
        dateid: song.dateid,
        songid: song.songid,
        songkey: song.songkey
      })
    )

    fetch('http://localhost:3001/saveselectedsong', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        selectedSongs: selectedSongs
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
    }})
    .catch(err => console.log('Fail to call saveselectedsong API: ' + err))

  }

  componentDidMount(){
    this.callGetPeriodAPI();
  }

  render() {
    
    return ( 
      <Container className="ma2">   
        
        <h1>Select Song</h1>
        
        <br/>

        <Form.Group>
          <Form.Label>Service Period</Form.Label>
          <Form.Control 
            as="select" 
            name="status"
              value={ this.state.selectedPeriod }
              onChange={ this.handlePeriodChange }
            >
              <option key="0" value="">Select Period</option>
              {
                this.state.allperiod.length > 0 &&
                this.state.allperiod.map((period) => 
                  <option key={ period.id } value={ period.id }>
                    { period.periodname }
                  </option>
                )
              }
            </Form.Control>
          </Form.Group>
  
          <Form.Group>
            <Form.Label>Date as Worship Leader</Form.Label>
            <Form.Control 
              as="select" 
              name="status"
                value={ this.state.selectedDate }
                onChange={ this.handleDateChange }
              >
                <option key="0" value="">Select Date</option>
                {
                  this.state.displayedDates.length > 0 &&
                  this.state.displayedDates.map((date) => 
                    <option key={ date.id } value={ date.id }>
                      { DateConvert(new Date(date.predefineddate)) }
                    </option>
                  )
                }
            </Form.Control>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Predefined Songs</Form.Label>
            <Form.Row>
            {this.state.displayedSongs.length > 0 &&
              this.state.displayedSongs.map(song => {
                return (
                  <Col 
                    key={ song.id }
                    md={5}
                    className='t v-top dib br3 ma2 shadow-2'
                  > 
                    <Form.Row className="bg-light-blue br--top br3 pa2">
                      <Col md={{ span: 10 }}><h1 className="f5 b">{ song.songname }</h1></Col>
                      <Col sm={{ span: 2 }}>
                        <MdAddCircleOutline size={25} className="pointer" onClick={ ()=>this.addSongFromList(song) } />
                        <MdVideoLibrary size={25} className="pointer" onClick={ ()=>this.openVideo(song.url1) }/>
                      </Col>
                    </Form.Row>

                    <div className="pa2">
                      <div className="f6 tl">
                        By: { song.composer }
                      </div>
                      <div className="f6 tl">
                        Type: { song.songtype }
                      </div>
                      <div className="f6 tl">
                        Lyric: { song.lyric.split('\n')[0] }...
                        <OverlayTrigger 
                          trigger="click" 
                          placement="auto" 
                          overlay={ <Popover id="popover-basic" title="Full Lyric">{song.lyric}</Popover> } 
                        >
                          <div className="dib pointer link dim blue">(Full lyric)</div>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </Col>
                )
              })
            }
            </Form.Row>
          </Form.Group>

          <Form.Group>
            <Form.Label>Selected Songs</Form.Label>
            <Form.Row>
              {this.state.selectedSongs.length > 0 &&
                this.state.selectedSongs.map((selectedSong, i) => {
                  return (
                    <div 
                      key={ selectedSong.songid }
                      className="tc dib br2 pa2 ma1 bw2 shadow-2"
                    >
                      <div className="pa1 b">
                        { selectedSong.songname }
                        <MdClose 
                          className="ml2 pointer"
                          onClick={ ()=>this.removeSong(selectedSong.songid) } />
                      </div>
                      <div className="dib ma1 f6">Key</div>
                      <div className="dib ma1 f6">                        
                        <Form.Control 
                          className="dib"
                          size="sm"
                          style={{ width: "auto" }}
                          as="select" 
                          name="songkey"
                          value={ selectedSong.songkey } 
                          onChange={ (e)=>this.handleKeyChange(selectedSong.songid, e) }
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
                      </div>
                    </div>
                  )
                })
              }
            </Form.Row>
          </Form.Group>

          <Form.Row>
            <Col className="tr">
              {
                this.state.selectedDate !== ''? 
                (
                  <Button className="ma1" onClick={ this.openSongModal }> 
                    Add from Master List
                  </Button> 
                ):
                (
                  null
                )
              }

              {
                this.state.selectedSongs.length > 0?
                (
                  <Button className="ma1" onClick={ this.submitSongSelection }>
                    Submit
                  </Button> 
                ):
                (
                  null
                )
              }
            </Col>
          </Form.Row>

          <SongModal
            songModalShow={ this.state.songModalShow }
            closeSongModal={ this.closeSongModal }
            addSong={ this.addSongOutofList }
          />

          <MessageModal
            show={ this.state.msgModalShow }
            onHide={ this.msgModalClose }
            headerText={ this.state.msgModalHeader }
            contentText1={ this.state.msgModalContent }
          />
          
        </Container> 
      )
  }
}
 
export default SelectSong;