import React, { Component } from 'react';
import { Container, Accordion, Card, Button, Modal, Popover, OverlayTrigger, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import { MdClose, MdAddCircleOutline, MdVideoLibrary, MdSearch } from 'react-icons/md';

class ServiceSong extends Component {

  constructor(props){
    super(props);
    this.state = {
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      songModalShow: false,
      searchSongName: '',
      filteredSongs: [], 
    }
  }

  songModalClose = () => {
    this.setState({ songModalShow: false })
    this.setState({ filteredSongs: [] })
    this.setState({ searchSongName: ''})
  }

  songModalOpen = () => {
    this.setState({ songModalShow: true })
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
          <Button onClick={this.songModalClose}>OK</Button>
        </Modal.Footer>
        
      </Modal>
    )
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

  showOverlay = () => {
    return (
      <Popover placement="right" id="popover-basic" title="Full Lyric">
        Hello basic
      </Popover>
    )
  }

	render(){
    
		return (
			<Container>

        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Scheduled Songs
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
              {
                this.props.scheduledSongs.map(song => {
                  return (
                    <div 
                      key={ "scheduled-" + song.songid }
                      className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
                    >
                      { song.songname } / { song.songkey }
                    </div>
                  )
                })
              }
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Selected Songs
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
              {
                this.props.selectedSongs.length > 0?
                (
                  <div>
                    {
                      this.props.selectedSongs.map(song => {
                        return (
                          <div 
                            key={ "selected-" + song.songid }
                            className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
                          >
                            { song.songname } / { song.songkey }
                          </div>
                        )
                      })
                    } 
                  </div>
                ):
                (
                  <div className="alert alert-info" role="alert">
                    Song has not been selected for this date.
                  </div>
                )
              }
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                On Stage Songs
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
              {
                this.props.selectedSongs.length > 0?
                (
                  <div>
                    {
                      this.props.realizedSongs.map(song => {
                        return (
                          <div 
                            key={ "realized-" + song.songid }
                            className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
                          >
                            { song.songname } / { song.songkey }
                            <MdClose 
                              className="ml2 pointer"
                              onClick={ ()=>this.props.removeSong(song.songid) } 
                            />
                          </div>
                        )
                      })
                    } 
                    
                    <div className="tc v-top dib br3 pa3 ma2 bw2 shadow-2">
                      <MdAddCircleOutline 
                        size={20} 
                        className="pointer dim" 
                        onClick={ this.songModalOpen }
                    />
                    </div>
    
                    {
                      this.callSongModal()
                    }
                  
                  </div>
                ):
                (
                  <div className="alert alert-info" role="alert">
                    Song has not been selected for this date.
                  </div>
                )
              }
              </Card.Body>
            </Accordion.Collapse>
          </Card>

        </Accordion>

			</Container>					
		);
	}
	
}

export default ServiceSong;