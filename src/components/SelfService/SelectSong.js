import React, { Component } from "react";
import { Form, Container, Col, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { MdAddCircleOutline, MdVideoLibrary, MdClose } from 'react-icons/md';
import { authenticationService } from '../../services/authenticationService';
import { callGetPeriodAPI, callGetSSPeriodDateAPI, callGetMasterFieldValuesAPI } from '../../helpers/apicall';
import { pdf } from '@react-pdf/renderer';
import MessageModal from '../MessageModal';
import SongModal from './SongModal';
import ServiceSongPdf from '../_reusables/R_ServiceSongPdf';

class SelectSong extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      periodList: [],
      selectedPeriod: '',
      displayedDates: [],
      selectedDate: '',
      displayedSongs: [],
      selectedSongs: [],
      songModalShow: false,
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
      songkeylists: [],
    }
    
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  openSongModal = () => {
    this.setState({ songModalShow: true })
  }

  closeSongModal = () => {
    this.setState({ songModalShow: false })
  }
  
  handlePeriodChange = (e) => {

    this.setState({ selectedPeriod: e.target.value, displayedDates: [], selectedSongs: [], displayedSongs: [] })

    callGetSSPeriodDateAPI(Number(e.target.value))
    .then(
      data => this.setState({ displayedDates: data }),
      error => this.setState({ selectedPeriod: '', displayedDates: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  handleDateChange = (e) => {
    
    var dateid = e.target.value

    if (dateid !== ''){
      this.callRoleValidationAPI(dateid)
      .then(eligibleUser => {
        if (eligibleUser.length === 0){
          let msg = "You are not scheduled as worship leader on this date. Only eligible worship leader can select song for this date."
          this.setState({ selectedDate: '', msgModalShow: true , msgModalHeader: 'Information', msgModalContent: msg })
        }
        else{
          this.setState({ selectedDate: dateid });
          this.callGetSongForSelectionAPI(dateid);
        }
      })
      .catch(() => this.setState({ selectedDate: '', msgModalShow: true , msgModalHeader: 'Information', msgModalContent: "Worship Leader for this date is not available yet" }))
    }
    else {
      this.setState({ selectedDate: '' });
    }
    
    this.setState({ selectedSongs: [] });
    this.setState({ displayedSongs: [] });

  }

  handleKeyChange = (songid, e) => {
    
    const { selectedSongs } = this.state;

    let foundIndex = selectedSongs.findIndex(updatedItem => updatedItem.songid === songid)

    let updatedSong = Object.assign({}, selectedSongs[foundIndex])
    updatedSong.songkey = Number(e.target.value)
    updatedSong.songkeydescr = this.returnKeyName(e.target.value)

    selectedSongs.splice(foundIndex, 1, updatedSong)
    this.setState({ selectedSongs });

  }

  returnDateValue = (dateid) => {
    return DateConvert(new Date(this.state.displayedDates.filter(date => date.id === Number(dateid))[0].predefineddate))
  }

  returnPeriodName = (periodid) => {
    return this.state.periodList.filter(period => period.id === Number(periodid))[0].description
  }

  returnKeyName = (keyid) => {
    return this.state.songkeylists.filter(songkey => songkey.id === Number(keyid))[0].description
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
      songkey: song.songkey,
      songkeydescr: song.songkeydescr,
      composer: song.composer,
      lyric: song.lyric,
      url1: song.url1
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
    if (window.confirm('Are you sure you wish to submit this schedule? All servants in charge will get notification for the song selection after you click OK.')) {
      this.callSaveSongSelectionAPI();
      this.sendNotification()
    }
  }

  sendNotification = () => {
    
    pdf(<ServiceSongPdf
      serviceDate={this.returnDateValue(this.state.selectedDate)}
      periodName={this.returnPeriodName(this.state.selectedPeriod)}
      selectedSongs={ this.state.selectedSongs } />)
      .toBlob()
      .then(data => {
        var reader = new FileReader();
        var base64data = ''
        if (data.type === 'application/pdf') {
          reader.readAsDataURL(data); 
          reader.onloadend = () => {
            base64data = reader.result.substr(reader.result.indexOf(',') + 1);           
            this.setState({ fileattachment: base64data }, ()=>this.callNotifyServantAPI() )
          }
        }
      });

  }
  
  callNotifyServantAPI = () => {
    
    const notifiedSongs = this.state.selectedSongs.map(song => ({
        songname: song.songname,
        songkey: song.songkeydescr,
        songurl: song.url1
      })
    ) 

    fetch(process.env.REACT_APP_BACKEND_URL + '/sendsongselection', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servicedateid: this.state.selectedDate,
        servicedate: this.returnDateValue(this.state.selectedDate),
        periodname: this.returnPeriodName(this.state.selectedPeriod),
        selectedsongs: notifiedSongs,
        fileattachment: this.state.fileattachment
      })
    })
    .then (response => response.json())
    .then(data => alert(data))
    .then(() => {
      this.setState({ selectedPeriod: '' });
      this.setState({ selectedDate: '' });
      this.setState({ displayedDates: [] });
      this.setState({ selectedSongs: [] });
      this.setState({ displayedSongs: [] });
    })
    .catch(err => console.log("Fail to call sendemailbyservice API --- " + err))     
  
  }

  callRoleValidationAPI = (dateid) => {
    let user = authenticationService.currentUser;
    
    return fetch(process.env.REACT_APP_BACKEND_URL + '/getservantbydate/' + dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => data.filter(schedule => schedule.servantid === Number(user.source._value.servantid)))
        .then(data => data.filter(schedule => schedule.rolename === 'Worship Leader'))
      }
    }) 
    .catch(err => console.log("Fail to call getservantbydate api: " + err))
		
  }

  callGetSongForSelectionAPI = (dateid) => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/getsongforselection/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ displayedSongs: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
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

    fetch(process.env.REACT_APP_BACKEND_URL + '/saveselectedsong', {
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

    window.scrollTo(0, 0);
    
    callGetPeriodAPI()
    .then(
      data => this.setState({ periodList: data }),
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

    callGetMasterFieldValuesAPI('Song Key')
    .then(
      data => this.setState({ songkeylists: data }),
      error => this.setState({ songkeylists: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  render() {
    
    return ( 
      <Container className="pa2">   
        
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
                this.state.periodList.length > 0 &&
                this.state.periodList.map((period) => 
                  <option key={ period.id } value={ period.id }>
                    { period.description }
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
                        Type: { song.songtypedescr }
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
                          {
                            this.state.songkeylists.length > 0 &&
                            this.state.songkeylists.map(songkey => {
                              return (
                                <option key={ songkey.id } value={ songkey.id }>{ songkey.description }</option> 
                              )
                            })
                          }
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
                  <Button bsPrefix="btn-custom" className="ma1" onClick={ this.openSongModal }> 
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
                  <Button bsPrefix="btn-custom" className="ma1" onClick={ this.submitSongSelection }>
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