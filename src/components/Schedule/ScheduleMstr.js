import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav, Button, Spinner } from "react-bootstrap";
import ScheduleSong from './ScheduleSong';
import ScheduleServant from './ScheduleServant';
import MessageModal from '../MessageModal';

class ScheduleMstr extends Component {
  
  constructor(props) {
    super(props);
    const period = this.props.location.state;
    
    window.scrollTo(0, 0);
    this.PAGE_PARENT = './ScheduleLP'
    
    this.state = {
      periodid: period.id,
      periodname: period.periodname,
      perioddescr: period.description,
      servantSchedule: [],
      songSchedule: [], 
      selectedSongs: [],
      periodDates: [],
      churchRoles: [],
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      spinnerShow: true
    }

  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
  }

  callGetPeriodDateAPI = (periodid) => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getperioddate/' + periodid, {
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
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getfieldvalues/Role List', {
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
    .catch(err => console.log('Fail to call getfieldvalues API: ' + err))

  }

  callGetSongScheduleAPI = (periodid) => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getsongschedule/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ songSchedule: data, spinnerShow: false }))
      }
      else {
        return response.json()
        .then(() => this.setState({ spinnerShow: false }))
      }
    }) 
    .catch(err => console.log('Fail to call getsongschedule API: ' + err))

  }

  callGetServantScheduleAPI = (periodid) => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/getservantschedule/'+periodid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ servantSchedule: data, spinnerShow: false }))
      }
      else {
        return response.json()
        .then(() => this.setState({ spinnerShow: false }))
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

        <Row>
          <Col className="tr">
            <Button className="ma1 tr" onClick={ ()=>this.props.history.push(this.PAGE_PARENT) }>  
              Return to Search
            </Button>
          </Col>
        </Row>

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
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first"> 
                  {
                    this.state.spinnerShow === false ?
                    ( 
                      this.state.songSchedule.length > 0?
                      (
                        <ScheduleSong
                          songSchedule = { this.state.songSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodname }
                          periodDescr = { this.state.perioddescr }
                          callGetSongScheduleAPI = { ()=>this.callGetSongScheduleAPI(this.state.periodid) }
                        /> 
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Song has not been scheduled for this period.
                        </div>
                      )
                    ): 
                    (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    )
                  } 
 
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  {
                    this.state.spinnerShow === false ?
                    ( 
                      this.state.servantSchedule.length > 0?
                      (
                        <ScheduleServant 
                          servantSchedule = { this.state.servantSchedule }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodname }
                          periodDescr = { this.state.perioddescr }
                          churchRoles = { this.state.churchRoles }
                        />
                      ):
                      (
                        <div className="alert alert-info" role="alert">
                          Servant has not been scheduled for this period.
                        </div>
                      )
                    ):
                    (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
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