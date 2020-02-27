import React, { Component } from 'react';
import { Container, Table, Row, Col, Alert } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MdVideoLibrary } from 'react-icons/md';
import SongPdf from './R_SongPdf';

class SelectedSong extends Component {

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
  
  openVideo = (videourl) => {
    if (videourl) {
      window.open(videourl, '_blank');
    }
  }

	render(){
		return (

      <Container>

        <Row className="mt2">
          <Col className="tc">
            
            <PDFDownloadLink className="btn-custom ma1"
              document={ <SongPdf periodDates={ this.props.periodDates } 
                          periodName={ this.props.periodName }
                          periodDescr={ this.props.periodDescr }
                          songSchedule={ this.props.selectedSongs }
                      />} 
              fileName={`Song_${this.props.periodName}.pdf`}
            >
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
            </PDFDownloadLink>
            
          </Col>
        </Row>
        
        <div className="tc mt2" name="songschedulearea">

          <Alert variant="info" className="mb2">
            <h4>{ this.props.periodName } ({ this.props.periodDescr })</h4>
          </Alert>

          {
            this.props.periodDates.map(date => {
              return(
                <Table responsive size="sm" bordered key={ date.id }>
                  <thead key={ 'th-' + date.id }>
                    <tr className="tc">
                      <th colSpan="5">{ DateConvert(new Date(date.predefineddate)) }</th>
                    </tr>
                    <tr className="tc">
                      <th className="tc w-10">#</th>
                      <th className="w-50">Song Name</th>
                      <th className="tc w-20">Type</th>
                      <th className="tc w-10">Key</th>
                      <th className="tc w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    this.props.selectedSongs.length > 0 &&
                    this.props.selectedSongs
                    .filter(song => Number(song.dateid)===date.id)
                    .map((song, i) => {
                      return (
                        <tr key={ 'tr-' + date.id + '-' + song.id } className={ this.returnBgColor(song.songtypedescr) }>
                          <td className="tc w-10"> {i+1}. </td>
                          <td className="tl w-50"> <b>{ song.songname }</b> <br/><i className="f6">({ song.lyric.split('\n')[0] }...)</i></td>
                          <td className="tc w-20"> { song.songtypedescr } </td>
                          <td className="tc w-10"> { song.songkeydescr } </td>
                          <td className="tc w-10"> <MdVideoLibrary size={25} className="pointer dim" onClick={ ()=>this.openVideo(song.url1) }/></td>
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

      </Container>	
      
		);
	}
	
}

export default SelectedSong;