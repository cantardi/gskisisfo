import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { callSearchSongAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function'
import SongSearch from './SongSearch';
import SongResult from './SongResult';
import MessageModal from '../MessageModal';

class SongLP extends Component {
  
  constructor(props){
    super(props);
    
    this.PAGE_CHILD = 'SongDtl';
    this.PAGE_PARENT = 'Administration';

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
    
    const { searchSongName, searchSongType, searchComposer } = this.state;
    const maxLine = 20;

    callSearchSongAPI(searchSongName, searchSongType, searchComposer, maxLine)
    .then(
      data => this.setState({ songList: data }),
      error => this.setState({ songList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  clearSearch = () => {
    this.setState({
      searchSongName: '',
      searchSongType: '',
      searchComposer: '',
      songList: []
    })
  }

  addSong = () => {
    history.push(this.PAGE_CHILD);
  }

  updateSong = (song) => {
    history.push(this.PAGE_CHILD, song);
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false }) 
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
          <Dropdown.Item onClick={ this.addSong }>
            Add New Song
          </Dropdown.Item>
          <Dropdown.Item onClick={ ()=>history.push('/SongSchedulerMstr') }>
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
              updateSong={ this.updateSong }
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
