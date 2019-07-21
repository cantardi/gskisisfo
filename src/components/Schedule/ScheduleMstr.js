import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav, Button } from "react-bootstrap";
import ScheduleSong from './ScheduleSong';
import ScheduleServant from './ScheduleServant';
import SelectedSongs from './SelectedSongs';
import MessageModal from '../MessageModal';

class ScheduleMstr extends Component {
  
  constructor(props) {
    super(props);
    const period = this.props.location.state;
    window.scrollTo(0, 0);
    
    this.state = {
      periodid: period.id,
      servantSchedule: [],
      songSchedule: [], 
      selectedSongs: [],
      periodDates: [],
      churchRoles: [],
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
    }

  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
  }

  callGetPeriodDateAPI = (periodid) => {
    
    fetch('http://localhost:3001/getperioddate/' + periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ periodDates: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperioddate API: ' + err))

  }
  
  callGetChurchRoleAPI = () => {
    
    fetch('http://localhost:3001/getchurchrole/', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ churchRoles: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getchurchrole API: ' + err))

  }

  callGetSongScheduleAPI = (periodid) => {

    fetch('http://localhost:3001/getsongschedule/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ songSchedule: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getsongschedule API: ' + err))

  }

  callGetServantScheduleAPI = (periodid) => {

    fetch('http://localhost:3001/getservantschedule/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ servantSchedule: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getservantschedule API: ' + err))

  }

  componentDidMount(){
    this.callGetPeriodDateAPI(this.state.periodid);
    this.callGetChurchRoleAPI();
    this.callGetSongScheduleAPI(this.state.periodid);
    this.callGetServantScheduleAPI(this.state.periodid);
  }

	render(){
    
		return (
			<Container className="ma2">

        <h1>Maintain Schedule</h1>
        
        <br/>

        <Row >
          <Col className="tr">
            <Button className="ma1" onClick={ this.editSchedule }>
              Edit
            </Button> 
            <Button className="ma1" onClick={ this.printSchedule }>
              Print
            </Button> 
            <Button className="ma1" onClick={ ()=>this.props.history.push('/ScheduleLP') }>  
              Return to Search
            </Button> 
          </Col>
        </Row>

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
                  <Nav.Link eventKey="third">Selected Songs</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">  
                  {
                    this.state.songSchedule.length > 0?
                    (
                      <ScheduleSong
                        songSchedule = { this.state.songSchedule }
                        periodDates = { this.state.periodDates }
                      /> 
                    ):
                    (
                      <div className="alert alert-info" role="alert">
                        Song has not been scheduled for this period.
                      </div>
                    )
                  } 
 
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  {
                    this.state.servantSchedule.length > 0?
                    (
                      <ScheduleServant 
                        servantSchedule = { this.state.servantSchedule }
                        periodDates = { this.state.periodDates }
                        churchRoles = { this.state.churchRoles }
                      />
                    ):
                    (
                      <div className="alert alert-info" role="alert">
                        Servant has not been scheduled for this period.
                      </div>
                    )
                  }
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  {
                    this.state.selectedSongs.length > 0?
                    (
                      <SelectedSongs 
                        selectedSongs = { this.state.selectedSongs }
                        periodDates = { this.state.periodDates }
                      />
                    ):
                    (
                      <div className="alert alert-info" role="alert">
                        Song has not been selected by Worship Leader for this period.
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

export default ScheduleMstr;