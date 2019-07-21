import React, { Component } from 'react';
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { DateConvert } from '../../helpers/function';

class ViewSongSchedule extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      modalShow: false, 
      modalMsg: '',
      modalHdr: '',
    }
  }

  printSongSchedule = () => {

  }
  
	render(){
    
		return (
      <Container className="ma2">
        
        <Row >
          <Col className="tr">
            <Button className="ma1" onClick={ this.printSongSchedule }>
              Print
            </Button>
          </Col>
        </Row>

        <br/>

        {this.props.periodDates.map(date => {
        return(
          <div>
            <Table responsive size="sm" bordered>
              <thead>
                <tr className="tc" key={ date.id } >
                  <th colspan="3">{ DateConvert(new Date(date.predefineddate)) }</th>
                </tr>
              </thead>
              {
                this.props.songSchedule.length > 0 &&
                  this.props.songSchedule
                  .filter(song => Number(song.dateid)===date.id)
                  .map((song, i) => {
                    let trBgColor = ''
                    switch(song.songtype){
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
                    return (
                      <tbody>
                        <tr key={ song.id } className={ trBgColor }>
                          <td className="tc w-10"> {i+1}. </td>
                          <td className="w-80"> { song.songname } <i>({ song.lyric.split('\n')[0] }...) </i></td>
                          <td className="tc w-10"> { song.songkey } </td>
                        </tr>
                      </tbody>
                    )
                  })
              }
            </Table>
          </div>
          )
        })}		
      </Container>	
		);
	}
	
}

export default ViewSongSchedule;