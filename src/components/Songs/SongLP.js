import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import {history} from '../../helpers/function'
import SongSearch from './SongSearch';
import SongResult from './SongResult';
import MessageModal from '../MessageModal';

class SongLP extends Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      songList: [],
      songlanglists: [],
      songtypelists: [],
      songkeylists: [],
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

  callSearchSongAPI = () => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/searchsong', {
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

  searchSong = () => {
    this.setState({ songList: [] });
    this.callSearchSongAPI();
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
    history.push(pagename);
  }

  openEditMode = (song) => {
    history.push('/SongDtl', song);
  }
  
  msgModalClose = () => {
    this.setState({ msgModalShow: false }) 
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.callGetMasterFieldValuesAPI()
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
          songTypeLists={ this.state.songtypelists }
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
