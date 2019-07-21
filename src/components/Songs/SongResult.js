import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class SongResult extends Component {

  render(){
    return (
      <Container className="ma2">
        <Table responsive>
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
                <tr key={i}>
                  <td className="w-10">{ i+1 }</td>
                  <td
                    className="fw6 blue no-underline underline-hover pointer w-30"
                    onClick={ ()=>this.props.openEditMode(song) }
                  >
                    { song.songname }
                  </td>
                  <td className="w-20">{ song.songtype }</td>
                  <td className="w-10">{ song.songkey }</td>
                  <td className="w-30">{ song.composer }</td>
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