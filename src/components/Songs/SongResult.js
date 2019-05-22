import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class SongResult extends Component {

  render(){
    return (
      <Container className="ma2">

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Song Name</th>
              <th>Song Type</th>
              <th>Song Key</th>
              <th>Composer</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.songList.map((song, i) => {
              return(
                <tr key= {i}>
                  <td>{ i+1 }</td>
                  <td 
                    style={ {cursor: 'pointer'} } 
                    className="fw6 blue no-underline underline-hover" 
                    onClick={ ()=>this.props.openEditMode(song) }>
                    { song.songname }</td>
                  <td>{ song.songtype }</td>
                  <td>{ song.songkey }</td>
                  <td>{ song.composer }</td>
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