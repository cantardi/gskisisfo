import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';

class SongSchedulerStep3 extends Component {
  
  returnBgColor = (songtypedescr) => {
    let trBgColor = ''
    switch(songtypedescr){
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

  render() {

    if (this.props.currentStep !== 3) { // Prop: The current step
      return null
    }

    if (this.props.isValidated === true) {
      return (
        <div>
        {
          this.props.displayedDates.map(date => {
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
                  this.props.selectedSongs.length > 0 &&
                  this.props.selectedSongs
                  .filter(selectedSong => Number(selectedSong.dateid)===date.id)
                  .map((selectedSong, i) => {
                    return (
                      <tr key={ 'tr-' + date.id + '-' + selectedSong.song.id } className={ this.returnBgColor(selectedSong.song.songtypedescr) }>
                        <td className="tc w-10"> {i+1}. </td>
                        <td className="w-60"> { selectedSong.song.songname } <i>({ selectedSong.song.lyric.split('\n')[0] }...) </i></td>
                        <td className="tc w-20"> { selectedSong.song.songtypedescr } </td>
                        <td className="tc w-10"> { selectedSong.song.songkeydescr } </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            )
          })
        }		
        </div>
      )
    }
    else {
      return (
        <div className="alert alert-info" role="alert">
          Song has not been selected for some pre-defined dates. Click on Previous button to complete the selection in order to submit.
        </div>
      )
    }
  }

}
 
export default SongSchedulerStep3;

