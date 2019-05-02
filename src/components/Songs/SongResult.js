import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class SongResult extends Component {

  render(){
    return (
      <Container className="ma2">
        <Table responsive="md">
          <thead>
            <tr>
              <th>#</th>
              <th>Song Name</th>
              <th>Song Type</th>
              <th>Composer</th>
              <th>Music By</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.songList !== null &&
              this.props.songList.map((song, i) => {
                return(
                  <tr key= {i}>
                    <td>{ i+1 }</td>
                    <td style={{cursor: 'pointer'}} className="fw6 db blue no-underline underline-hover" onClick={this.props.openEditMode}>{ song.name }</td>
                    <td>{ song.type }</td>
                    <td>{ song.composer }</td>
                    <td>{ song.musicby }</td>
                  </tr>
                )
              })
          }
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default SongResult;