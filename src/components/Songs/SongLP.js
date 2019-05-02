import React, { Component } from 'react';
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import SongSearch from "./SongSearch";
import SongResult from "./SongResult";

class SongLP extends Component {
  constructor(props){
    super(props);
    this.state = {
      songList: [{
        name: 'Ajarku Setia',
        type: 'Worship',
        composer: 'Erastus Sabdono',
        musicby: 'Stephen Erastus'
      }],
      searchClicked: false,
    }
  }
  
  searchSong = () => {
    this.setState({ searchClicked: true})
  }

  openEditMode = () => {
    this.props.history.push('/SongDtl')
  }
  
  render() {
    return (
      <Container className="pa2">
        <DropdownButton className="ma2"
                          title="Action"
                          id="dropdown-secondary-button"
                          key="songAction"
                          align="right">               
          <Dropdown.Item onClick={()=> this.props.history.push('/SongDtl')}>Add New Song</Dropdown.Item>
          <Dropdown.Item onClick={()=> this.props.history.push('/SongSchedulerMstr')}>Schedule Song</Dropdown.Item>
        </DropdownButton>

        <SongSearch searchSong={ this.searchSong } />
        {
          this.state.searchClicked === true &&
          <SongResult songList={ this.state.songList } openEditMode={ this.openEditMode } />
        }
        
      </Container>
    );
  }
}

export default SongLP;
