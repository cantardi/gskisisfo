import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';

class SelectedSongs extends Component {
  
  returnBgColor = (songtype) => {
    let trBgColor = ''
    switch(songtype){
      case 'Worship':
        trBgColor = 'bg-light-blue';
        break;
      case 'Praise':
        trBgColor = 'bg-light-green';
        break;
      case 'Hymn':
        trBgColor = 'bg-light-yellow';
        break;
      case 'Sermon Intro':
        trBgColor = 'bg-washed-red';
        break;
      default:
        trBgColor = 'bg-white';
        break;
    }
    return trBgColor;
  }

	render(){
    
		return (
      <Container>
        {
          this.props.periodDates.map(date => {
            return(
              <Table responsive size="sm" bordered key={ date.id }>
                <thead key={ 'th-' + date.id }>
                  <tr className="tc">
                    <th colSpan="4">{ DateConvert(new Date(date.predefineddate)) }</th>
                  </tr>
                  <tr className="tc">
                    <th className="tc w-10">#</th>
                    <th className="w-60">Song Name</th>
                    <th className="tc w-20">Type</th>
                    <th className="tc w-10">Key</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.props.songSchedule.length > 0 &&
                  this.props.songSchedule
                  .filter(song => Number(song.dateid)===date.id)
                  .map((song, i) => {
                    return (
                      <tr key={ 'tr-' + date.id + '-' + song.id } className={ this.returnBgColor(song.songtype) }>
                        <td className="tc w-10"> {i+1}. </td>
                        <td className="w-60"> { song.songname } <i>({ song.lyric.split('\n')[0] }...) </i></td>
                        <td className="tc w-20"> { song.songtype } </td>
                        <td className="tc w-10"> { song.songkey } </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            )
          })
        }	
      </Container>	
		);
	}
	
}

export default SelectedSongs;