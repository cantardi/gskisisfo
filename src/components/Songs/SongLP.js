import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import SongAction from "./SongAction";
import SongSearch from "./SongSearch";
import SongResult from "./SongResult";

class SongLP extends Component {
  render() {
    return (
      <Container className="pa2">
        <SongAction />
        <SongSearch />
        <SongResult />
      </Container>
    );
  }
}

export default SongLP;
