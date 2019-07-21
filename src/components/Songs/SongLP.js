import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import SongSearch from './SongSearch';
import SongResult from './SongResult';
import MessageModal from '../MessageModal';

class SongLP extends Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      songList: [],
      searchSongName: '',
      searchSongType: '',
      searchComposer: '',
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
    }
  }
  
  handleSongSearchChange = (e) => {
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
        limit: 20
      })
    })
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState({ songList: data }))
        }
        else { 
          return response.json()
          .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
        }
      }) 
      .catch(err => console.log("Fail to call searchsong API: " + err)) 
  }

  clearSearch = () => {
    this.setState({
      searchSongName: '',
      searchSongType: '',
      searchComposer: '',
      songList: []
    })
  }

  routeToPage = (pagename) => {
    this.props.history.push(pagename);
  }

  openEditMode = (song) => {
    this.props.history.push('/SongDtl', song);
  }
  
  msgModalClose = () => {
    this.setState({ msgModalShow: false }) 
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
          handleChange={ this.handleSongSearchChange }
        />
        
        {
          this.state.songList.length > 0 &&
          <div>
            <div className="alert alert-info" role="alert">
              Search feature will display only the first 20 rows.
              Please filter your search for optimum result.
            </div>
            <SongResult 
              songList={ this.state.songList } 
              openEditMode={ this.openEditMode }
            />
          </div>
        }
        
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

export default SongLP;
