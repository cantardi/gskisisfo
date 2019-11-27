import React, { Component } from 'react';
import { Button, Modal, Popover, OverlayTrigger, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import { MdAddCircleOutline, MdVideoLibrary, MdSearch } from 'react-icons/md';

class SongModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      searchSongName: '',
      filteredSongs: [],
    }
  }

  closeSongModal = () => {
    this.setState({ filteredSongs: [] }, this.props.closeSongModal)
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

    fetch(process.env.REACT_APP_BACKEND_URL + '/searchSong', {
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

	render(){
    
    return(
      <Modal show={this.props.songModalShow} onHide={this.closeSongModal} size="xl">

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
                      <MdAddCircleOutline size={25} className="pointer dim" onClick={ ()=>this.props.addSong(filteredSong) } />
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
          <Button onClick={this.closeSongModal}>OK</Button>
        </Modal.Footer>
        
      </Modal>	
		);
	}
	
}

export default SongModal;