import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import SongSearch from "./SongSearch";
import SongResult from "./SongResult";
import MessageModal from "../MessageModal";

class SongLP extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      songList: [],
      searchSongName: '',
      searchSongType: '',
      searchComposer: '',
      modalShow: false, 
      modalMsg: '',
      modalHdr: '',
    }
  }
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  searchSong = () => {
    this.setState({ songList: [] });
    
    fetch('http://localhost:3001/searchSong', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        songname: this.state.searchSongName,
        songtype: this.state.searchSongType,
        composer: this.state.searchComposer,
      })
    })
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState(Object.assign(this.state.songList, data)))
        }
        else { 
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
        }
      }) 
      .catch(err => console.log)  
  }

  clearSearch = () => {
    this.setState({
      searchSongName: '',
      searchSongType: '',
      searchComposer: ''
    })
  }

  openEditMode = (song) => {
    this.props.history.push('/SongDtl', song);
  }
  
  modalClose = () => this.setState({ modalShow: false })

  routeToPage = (pagename) => {
    this.props.history.push(pagename);
  }

  render() {

    return (
      <Container className="pa2">
        <DropdownButton 
          className="ma2"
          title="Action"
          id="dropdown-secondary-button"
          key="songAction"
          align="right"
        >               
          <Dropdown.Item onClick={ ()=>this.routeToPage('/SongDtl') }>
            Add New Song
          </Dropdown.Item>
          <Dropdown.Item onClick={ ()=>this.routeToPage('/SongSchedulerMstr') }>
            Schedule Song
          </Dropdown.Item>
        </DropdownButton>

        <SongSearch 
          songName={ this.state.searchSongName }
          songType={ this.state.searchSongType }
          songComposer={ this.state.searchComposer }
          searchSong={ this.searchSong }
          clearSearch={ this.clearSearch } 
          handleChange={ this.handleChange }
        />
        
        {
          this.state.songList !== null &&
          <SongResult 
            songList={ this.state.songList } 
            openEditMode={ this.openEditMode }
          />
        }
        
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

export default SongLP;
