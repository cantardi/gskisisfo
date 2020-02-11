import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav, Spinner } from 'react-bootstrap';
import { callGetPeriodDateAPI, callGetSongScheduleAPI, callGetServantScheduleAPI, callGetSongByDateAPI, callGetSongSelectedByDateAPI, callGetServantByDateAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function';
import ScheduleSong from './R_ScheduleSong';
import ScheduleServant from './R_ScheduleServant';
import MessageModal from '../MessageModal';

class MaintainSchedule extends Component {
  
  constructor(props) {
    super(props);
    const period = this.props.location.state.period;
    
    this.state = {
      PAGE_PARENT: this.props.location.state.PAGE_PARENT,
      periodid: period.id,
      periodname: period.periodname,
      perioddescr: period.description,
      editDisplayFlag: this.props.location.state.editFlag,
      notifyDisplayFlag: this.props.location.state.notifyFlag,
      servantSchedule: [],
      servantList: [],
      roleList: [],
      songSchedule: [], 
      selectedSongs: [],
      periodDates: [],
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      songSpinnerShow: true,
      songSelSpinnerShow: true,
      servantSpinnerShow: true
    }

  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
  }

  componentDidMount(){
    
    window.scrollTo(0, 0);
    
    let selectedDate = this.props.location.state.selectedDate;

    const { periodid } = this.state

    if (typeof selectedDate === 'undefined'){  
      
      callGetPeriodDateAPI(periodid)
      .then(
        data => this.setState({ periodDates: data }),
        error => this.setState({ periodDates: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
  
      callGetSongScheduleAPI(periodid)
      .then(
        data => this.setState({ songSchedule: data }),
        error => console.log(error.message)
      )
      .then(() => this.setState({ songSpinnerShow: false }))
      .catch(err => console.log("Fail to call API due to: " + err))
      
      callGetServantScheduleAPI(periodid)
      .then(
        data => this.setState({ servantSchedule: data }),
        error => console.log(error.message)
      )
      .then(() => this.setState({ servantSpinnerShow: false }))
      .catch(err => console.log("Fail to call API due to: " + err))

    }
    else {
      this.state.periodDates.push(selectedDate);

      callGetSongByDateAPI(selectedDate.id)
      .then(
        data => this.setState({ songSchedule: data }),
        error => console.log(error.message)
      )
      .then(() => this.setState({ songSpinnerShow: false }))
      .catch(err => console.log("Fail to call API due to: " + err))
      
      callGetSongSelectedByDateAPI(selectedDate.id)
      .then(
        data => this.setState({ selectedSongs: data }),
        error => console.log(error.message)
      )
      .then(() => this.setState({ songSelSpinnerShow: false }))
      .catch(err => console.log("Fail to call API due to: " + err))

      callGetServantByDateAPI(selectedDate.id)
      .then(
        data => this.setState({ servantSchedule: data }),
        error => console.log(error.message)
      )
      .then(() => this.setState({ servantSpinnerShow: false }))
      .catch(err => console.log("Fail to call API due to: " + err))

    }
  
  }

	render(){
    
		return (
			<Container className="pa2">

        <h1>Maintain Schedule</h1>
        
        <br/>
        
        <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Servant Schedule</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Song Schedule</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third" onClick={()=>history.push(this.state.PAGE_PARENT)}>Back</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                
                <Tab.Pane eventKey="first">
                  {
                    this.state.servantSpinnerShow === false ?
                    ( 
                      this.state.servantSchedule.length > 0?
                      (
                        <ScheduleServant 
                          servantSchedule = { this.state.servantSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodname }
                          periodDescr = { this.state.perioddescr }
                          editDisplayFlag = { this.state.editDisplayFlag }
                          notifyDisplayFlag = { this.state.notifyDisplayFlag }
                          reloadData = { this.callGetServantScheduleAPI }
                          PAGE_PARENT = { this.state.PAGE_PARENT }
                        />
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Servant has not been scheduled for this period.
                        </div>
                      )
                    ):
                    (
                      <div className="tc pa4">
                        <Spinner animation="grow" variant="primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner> 
                        <div>Loading...</div>
                      </div>
                    )
                  }
                </Tab.Pane>
                
                <Tab.Pane eventKey="second"> 
                  {
                    this.state.songSpinnerShow === false ?
                    ( 
                      this.state.songSchedule.length > 0?
                      (
                        <ScheduleSong
                          songSchedule = { this.state.songSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodname }
                          periodDescr = { this.state.perioddescr }
                          editDisplayFlag = { this.state.editDisplayFlag }
                          reloadData = { this.callGetSongScheduleAPI }
                          PAGE_PARENT = { this.state.PAGE_PARENT }
                        /> 
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Song has not been scheduled for this period.
                        </div>
                      )
                    ): 
                    (
                      <div className="tc pa4">
                        <Spinner animation="grow" variant="primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner> 
                        <div>Loading...</div>
                      </div>
                    )
                  } 
 
                </Tab.Pane>
                
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        <MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent }
        />

      </Container>	
      				
		);
	}
	
}

export default MaintainSchedule;