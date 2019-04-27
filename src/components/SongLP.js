import React, { Component } from 'react';
import Calendar from "./components/Calendar";
import Communication from "./components/Communication";
import Home from "./components/Home";
import Administration from "./components/Administration";
import AccountSetup from "./components/AccountSetup";
import SignOut from "./components/SignOut";


class SongLP extends Component {
  render() {
    return (
      <div>
        <SongAction />
        <SearchSong />
        <SearchResult />
      </div>
    );
  }
}

export default SongLP;
