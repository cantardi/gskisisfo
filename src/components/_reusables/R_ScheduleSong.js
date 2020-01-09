import React, { Component } from 'react';
import { Container, Table, Button, Row, Col, Alert } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MdVideoLibrary } from 'react-icons/md';
import { history } from '../../helpers/function'
import SongPdf from './R_SongPdf';
import ScheduleSongEditModal from './R_ScheduleSongEditModal';

class ScheduleSong extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      editSongSchedModalShow: false
    }
  }

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
  
  editSongSchedModalClose = () => {
    this.setState({ editSongSchedModalShow: false })
  }

  editSchedule = () => {
    this.setState({ editSongSchedModalShow: true })
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
            
            {
              this.props.editDisplayFlag === true?
              (
                <Button className="ma1" onClick={ this.editSchedule }>
                  Edit
                </Button>
              ): 
              (
                null
              )
            }
      
            <PDFDownloadLink className="btn btn-primary ma1" 
              document={ <SongPdf periodDates={ this.props.periodDates } 
                          periodName={ this.props.periodName }
                          periodDescr={ this.props.periodDescr }
                          songSchedule={ this.props.songSchedule }
                        />} 
              fileName={`Song_${this.props.periodName}.pdf`}
            >
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
            </PDFDownloadLink>

            <Button className="ma1" onClick={ ()=>history.push(this.props.PAGE_PARENT) }>  
              Return to Search
            </Button>

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
                    this.props.songSchedule.length > 0 &&
                    this.props.songSchedule
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

        <ScheduleSongEditModal
          show={ this.state.editSongSchedModalShow }
          onHide={ this.editSongSchedModalClose }
          displayedDates={ this.props.periodDates }
          selectedSongs = { this.props.songSchedule }
          periodid = { this.props.periodid }
          reloadData = { this.props.reloadData }
        />

      </Container>	
      
		);
	}
	
}

export default ScheduleSong;