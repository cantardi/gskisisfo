import React, { Component } from 'react';
import { Table, Button, OverlayTrigger, Modal, InputGroup, FormControl, Row, Col, Popover } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import MessageModal from '../MessageModal';
import { MdSearch, MdAddCircleOutline, MdVideoLibrary, MdClose } from 'react-icons/md';

class SongSchedulerStep2 extends Component {

  constructor(props){
    super(props);
    this.state = {
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      songModalShow: false,
      searchSongName: '',
      filteredSongs: [], 
      currentdateid: '',
    }
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }
  
  songModalClose = () => {
    this.setState({ songModalShow: false })
    this.setState({ filteredSongs: [] })
    this.setState({ searchSongName: ''})
  }

  songModalOpen = (e) => {
    this.setState({ songModalShow: true })
    this.setState({ currentdateid: e.target.id })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  enterKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.searchSong();
    }
  }

  callSearchSongAPI = () => {

    fetch('https://gskisisfobackend.herokuapp.com/searchSong', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        songname: this.state.searchSongName,
        songtype: '',
        composer: '',
        limit: 10
      })
    })
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState({ filteredSongs: data }))
        }
        else { 
          return response.json()
          .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
        }
      }) 
      .catch(err => console.log('Fail to call searchsong API: ' + err))

  }

  searchSong = () => {
    this.setState({ filteredSongs: [] });
    this.callSearchSongAPI();
  }

  openVideo = (videourl) => {
    if (videourl) {
      window.open(videourl, '_blank');
    }
  }

  callSongModal = () => {
    return(
      <Modal show={this.state.songModalShow} onHide={this.songModalClose} size="xl">

        <Modal.Header closeButton><h4>Select Song</h4></Modal.Header>
        
        <Modal.Body className="tc">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Song Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Enter song name here"
              name="searchSongName"
              onChange={ this.handleChange } 
              onKeyPress={ this.enterKeyPress }
            />
            <MdSearch size={35} className="pointer dim" onClick={ this.searchSong } />
          </InputGroup>

          <div className="alert alert-info" role="alert">
            Search feature will display only the first 10 rows.
            Please filter your search for optimum result.
          </div>

          {
            this.state.filteredSongs.length > 0 &&
            this.state.filteredSongs.map(filteredSong => {
              return (
                <Col 
                  key={ filteredSong.id }
                  lg={5}
                  className='t v-top dib br3 ma2 shadow-2'
                > 
                  <Row className="bg-light-blue br--top br3 pa2 tc">
                    <div className="w-80"><h1 className="f5 b">{ filteredSong.songname }</h1></div>
                    <div className="w-20">
                      <MdAddCircleOutline size={25} className="pointer dim" onClick={ ()=>this.props.addSong(this.state.currentdateid, filteredSong) } />
                      <MdVideoLibrary size={25} className="pointer dim" onClick={ ()=>this.openVideo(filteredSong.url1) }/>
                    </div>
                  </Row>

                  <div className="pa2">
                    <div className="f6 tl">
                      By: { filteredSong.composer }
                    </div>
                    <div className="f6 tl">
                      Type: { filteredSong.songtype }
                    </div>
                    <div className="f6 tl">
                      Lyric: { filteredSong.lyric.split('\n')[0] }...
                      <OverlayTrigger 
                        trigger="click" 
                        placement="auto" 
                        overlay={ <Popover id="popover-basic" title="Full Lyric">{filteredSong.lyric}</Popover> } 
                      >
                        <div className="dib pointer link dim blue">(Full lyric)</div>
                      </OverlayTrigger>
                    </div>
                  </div>
                </Col>

              )
            })
          }
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.songModalClose}>OK</Button>
        </Modal.Footer>
        
      </Modal>
    )
  }

  render() {
    
    if (this.props.currentStep !== 2) { // Prop: The current step
      return null
    }

    return (   
      <div>
        {
          this.props.displayedDates.map(date => {
          return(
            <Table key={ 'tbl'+date.id } responsive>            
              <thead>
                <tr>

                  <th key={ 'th'+date.id }>
                    { DateConvert(new Date(date.predefineddate)) } 
                  </th>
                  
                  <th>
                    <Button key={ 'btn'+date.id } id={ date.id } onClick={ this.songModalOpen }>Select Song</Button>
                  </th>

                </tr>
              </thead>
              <tbody>
                <tr> 
                  <td colSpan="2">
                    {
                      this.props.selectedSongs.length > 0 &&
                      this.props.selectedSongs
                      .filter(selectedSong => Number(selectedSong.dateid)===date.id)
                      .map(selectedSong => {
                        return (
                          <div 
                            key={ selectedSong.song.id }
                            className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
                          >
                            { selectedSong.song.songname }
                            <MdClose 
                              className="ml2 pointer dim"
                              onClick={ ()=>this.props.removeSong('div_' + date.id + '_' + selectedSong.song.id) } />
                          </div>
                        )
                      })
                    }
                  </td>
                </tr>
              </tbody>
            </Table>
          )})
        }    

        {
          this.callSongModal()
        }

        <MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent }
        />

      </div>
    )
  }

}
 
export default SongSchedulerStep2;

