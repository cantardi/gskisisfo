import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav, Spinner } from 'react-bootstrap';
import { callGetPeriodDtlAPI, callGetPeriodDateDtlAPI, callGetSongByDateAPI, callGetSongSelectedByDateAPI, callGetServantByDateAPI } from '../../helpers/apicall';
import { authenticationService } from '../../services/authenticationService';
import ScheduleSong from './R_ScheduleSong';
import ScheduleServant from './R_ScheduleServant';
import MessageModal from '../MessageModal';

class ViewScheduleById extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      selectedDate: this.props.match.params,
      editDisplayFlag: false,
      notifyDisplayFlag: false,
      servantSchedule: [],
      songSchedule: [], 
      selectedSongs: [],
      periodName: '',
      periodDescr: '',
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
    
    const { selectedDate } = this.state
    const user = authenticationService.currentUser;

    if (user.source._value.role === 'Admin') {
      this.setState({ editDisplayFlag: true, notifyDisplayFlag: true })
    }
    else {
      this.setState({ editDisplayFlag: false, notifyDisplayFlag: false })
    }

    callGetPeriodDtlAPI(selectedDate.id)
    .then(
      data => this.setState({ periodName: data[0].periodname, periodDescr: data[0].description }),
      error => console.log(error.message)
    )
    .catch(err => console.log("Fail to call API due to: " + err))

    callGetPeriodDateDtlAPI(selectedDate.id)
      .then(
        data => this.setState({ periodDates: data }),
        error => console.log(error.message)
      )
      .catch(err => console.log("Fail to call API due to: " + err))

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

	render(){
    
		return (
			<Container className="pa2">

        <h1>View Schedule</h1>
        
        <br/>
        
        <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Song Schedule</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Servant Schedule</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Song Selected</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                
                <Tab.Pane eventKey="first"> 
                  {
                    this.state.songSpinnerShow === false ?
                    ( 
                      this.state.songSchedule.length > 0?
                      (
                        <ScheduleSong
                          songSchedule = { this.state.songSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodName }
                          periodDescr = { this.state.periodDescr }
                          editDisplayFlag = { this.state.editDisplayFlag }
                          reloadData = { this.callGetSongScheduleAPI }
                          PAGE_PARENT = { this.state.PAGE_PARENT }
                        /> 
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Song has not been scheduled for this date.
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
                    this.state.servantSpinnerShow === false ?
                    ( 
                      this.state.servantSchedule.length > 0?
                      (
                        <ScheduleServant 
                          servantSchedule = { this.state.servantSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodName }
                          periodDescr = { this.state.periodDescr }
                          editDisplayFlag = { this.state.editDisplayFlag }
                          notifyDisplayFlag = { this.state.notifyDisplayFlag }
                          reloadData = { this.callGetServantScheduleAPI }
                          PAGE_PARENT = { this.state.PAGE_PARENT }
                        />
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Servant has not been scheduled for this date.
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

                <Tab.Pane eventKey="third"> 
                  {
                    this.state.songSelSpinnerShow === false ?
                    ( 
                      this.state.selectedSongs.length > 0?
                      (
                        <ScheduleSong
                          songSchedule = { this.state.songSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodName }
                          periodDescr = { this.state.periodDescr }
                          editDisplayFlag = { this.state.editDisplayFlag }
                          reloadData = { this.callGetSongScheduleAPI }
                          PAGE_PARENT = { this.state.PAGE_PARENT }
                        /> 
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Song has not been selected for this date.
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

export default ViewScheduleById;