import React, { Component } from 'react';
import { Table, Button, OverlayTrigger, Modal, InputGroup, FormControl, Row, Col, Popover } from 'react-bootstrap';
import { MdSearch, MdAddCircleOutline, MdVideoLibrary, MdClose } from 'react-icons/md';
import { DateConvert } from '../../helpers/function';
import { callSearchSongAPI, callAddSongSchedAPI, callDeleteSongSchedAPI } from '../../helpers/apicall';
import MessageModal from '../MessageModal';

class ScheduleSongEditModal extends Component {

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
      selectedSongs: [],
      addedSongs: [],
      deletedSongs: [],
    }
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  disableSelectButton = (predefineddate) => {
    if (new Date(predefineddate).getTime() < new Date().getTime() ){
      return true
    }
    else {
      return false
    }
  }

  disableSaveButton() {
    const { addedSongs, deletedSongs } = this.state

    if (addedSongs.length > 0 || deletedSongs.length > 0) {
      return false
    }
    else {
      return true
    }
  }

  songModalClose = () => {
    this.setState({ songModalShow: false })
    this.setState({ searchSongName: ''})
    this.setState({ currentdateid: ''})
    this.setState({ filteredSongs: [] })
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

  callSongModal = () => {
    return(
      <Modal show={this.state.songModalShow} onHide={this.songModalClose} size="lg">

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
                      <MdAddCircleOutline size={25} className="pointer dim" onClick={ ()=>this.addSong(this.state.currentdateid, filteredSong) } />
                      <MdVideoLibrary size={25} className="pointer dim" onClick={ ()=>this.openVideo(filteredSong.url1) }/>
                    </div>
                  </Row>

                  <div className="pa2">
                    <div className="f6 tl">
                      By: { filteredSong.composer }
                    </div>
                    <div className="f6 tl">
                      Type: { filteredSong.songtypedescr }
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
          <Button bsPrefix="btn-custom" onClick={this.songModalClose}>OK</Button>
        </Modal.Footer>
        
      </Modal>
    )
  }

  searchSong = () => {
    
    const { searchSongName } = this.state
    const maxLine = 10;

    callSearchSongAPI(searchSongName, '', '', maxLine)
    .then(
      data => this.setState({ filteredSongs: data }),
      error => this.setState({ filteredSongs: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
    
  }

  openVideo = (videourl) => {
    if (videourl) {
      window.open(videourl, '_blank');
    }
  }

  addSong = (dateid, song) => {
    const { selectedSongs, addedSongs, deletedSongs } = this.state;
    const reactobjid = 'div_' + dateid + '_' + song.id;

    let addedSong = { id: '', songid: song.id, songname: song.songname, dateid: Number(dateid), reactobjid}
    
    if (this.validateSong(addedSong).length > 0){
      alert('Song already exists')
    }
    else{

      const previouslyDeletedSong = this.checkExistInDeletedSong(addedSong)

      if (previouslyDeletedSong.length === 0){
        addedSongs.push(addedSong) 
        selectedSongs.push(addedSong);

        this.setState({ selectedSongs, addedSongs })
      }
      else {
        let addedSong = { id: previouslyDeletedSong[0].id, songid: song.id, songname: song.songname, dateid: Number(dateid), reactobjid}
        selectedSongs.push(addedSong);
        let newDeletedSongs = deletedSongs.filter(newArray => newArray.reactobjid !== reactobjid )
        
        this.setState({ selectedSongs, deletedSongs: newDeletedSongs }); 
      }
      
      
    }
  }

  checkExistInDeletedSong = (song) => {
    return this.state.deletedSongs
      .filter(deletedSong => deletedSong.reactobjid===song.reactobjid)
  }

  removeSong = (id, reactobjid) => {
 
    if (window.confirm('Are you sure to delete this item?')) {
      const { selectedSongs, addedSongs, deletedSongs } = this.state;

      if (id !== '') {
        deletedSongs.push({ id, reactobjid });
        this.setState({ deletedSongs });  
      }

      let newSelectedSongs = selectedSongs.filter(newArray => newArray.reactobjid !== reactobjid )
      let newAddedSongs = addedSongs.filter(newArray => newArray.reactobjid !== reactobjid )
      
      this.setState({ selectedSongs: newSelectedSongs });
      this.setState({ addedSongs: newAddedSongs });

    }

  }

  validateSong(song) {
    return this.state.selectedSongs
      .filter(selectedSong => selectedSong.reactobjid===song.reactobjid)
  }

  saveEditedSchedule = () => {
    const { addedSongs, deletedSongs } = this.state

    if (addedSongs.length > 0){

      const finalAddLists = this.state.addedSongs.map(song => ({
        periodid: this.props.periodid,
        dateid: song.dateid,
        songid: song.songid
      }))
      
      callAddSongSchedAPI(finalAddLists)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, addedSongs: [] }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message, addedSongs: [] })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
      
    }

    if (deletedSongs.length > 0){
      
      const finalDeleteLists = this.state.deletedSongs.map(song => song.id)

      callDeleteSongSchedAPI(finalDeleteLists)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, deletedSongs: [] }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message, deletedSongs: [] })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
      
    }
    
    //this.props.reloadData(this.props.periodid)
    //this.props.onHide()
  }

  componentDidMount() {
    const restructurizedSongs = []

    this.props.selectedSongs.map(song => {
      return (
        restructurizedSongs.push({
          id: song.id,
          songid: song.songid,
          songname: song.songname,
          dateid: song.dateid,
          reactobjid: "div_" + song.dateid + "_" + song.songid
        })        
      )
    })

    this.setState({selectedSongs: restructurizedSongs})
  }

	render(){
    
    return(
      <Modal show={ this.props.show } onHide={ this.props.onHide } size="xl">

        <Modal.Header closeButton><h4>Edit Song Schedule</h4></Modal.Header>
        
        <Modal.Body>
          
          <div className="alert alert-info" role="alert">
            Update the song schedule as required. Past schedule will be disabled for data integrity purpose.
          </div>
          
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
                      <Button key={ 'btn'+date.id } 
                        bsPrefix="btn-custom" 
                        id={ date.id } 
                        onClick={ this.songModalOpen } 
                        disabled={ this.disableSelectButton(date.predefineddate) }
                      >Select Song</Button>
                    </th>

                  </tr>
                </thead>
                <tbody>
                  <tr> 
                    <td colSpan="2">
                      {
                        this.state.selectedSongs.length > 0 &&
                        this.state.selectedSongs
                        .filter(selectedSong => Number(selectedSong.dateid)===date.id)
                        .map(selectedSong => {
                          return (
                            <div 
                              key={ selectedSong.dateid + "-" + selectedSong.songid }
                              className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
                            >
                              { selectedSong.songname }

                              {
                                this.disableSelectButton(date.predefineddate) === true?
                                null:
                                (
                                  <MdClose 
                                    className="ml2 pointer dim"
                                    disabled={ this.disableSelectButton(date.predefineddate) }
                                    onClick={ ()=>this.removeSong(selectedSong.id, 'div_' + date.id + '_' + selectedSong.songid) } />
                                )
                              }
                              
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

        </Modal.Body>

        <Modal.Footer>
          <Button bsPrefix="btn-custom" onClick={ this.saveEditedSchedule } disabled={ this.disableSaveButton() }>Save</Button>
          <Button bsPrefix="btn-custom" onClick={ this.props.onHide }>Cancel</Button>
        </Modal.Footer>
        
      </Modal>	
		);
	}
	
}

export default ScheduleSongEditModal;