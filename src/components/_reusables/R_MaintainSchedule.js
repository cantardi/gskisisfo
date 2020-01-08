import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav, Spinner } from 'react-bootstrap';
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

  callGetServantAPI = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/getservant', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ servantList: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getservant API: ' + err))
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
  
  callGetServantByDateAPI = (dateid) => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/getservantbydate/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ servantSchedule: data, spinnerShow: false }))
      }
    }) 
    .catch(err => console.log('Fail to call getservantbydate API --- ' + err))

  }

  callGetSongByDateAPI = (dateid) => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getsongbydate/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ songSchedule: data, spinnerShow: false}))
      }
    }) 
    .catch(err => console.log('Fail to call getsongbydate API --- ' + err))
  }

  callGetSongSelectedByDateAPI = (dateid) => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/getsongselectedbydate/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => {
          this.setState({ selectedSongs: data, spinnerShow: false })
        })
      }
    }) 
    .catch(err => console.log('Fail to call getsongselectedbydate API ---' + err))

  }

  componentDidMount(){
    
    window.scrollTo(0, 0);
    
    this.callGetServantAPI();
    this.callGetChurchRoleAPI();
    
    let selectedDate = this.props.location.state.selectedDate;

    if (typeof selectedDate === 'undefined'){  
      this.callGetPeriodDateAPI(this.state.periodid);  
      this.callGetSongScheduleAPI(this.state.periodid);
      this.callGetServantScheduleAPI(this.state.periodid);
    }
    else {
      this.state.periodDates.push(selectedDate);
      this.callGetSongByDateAPI(selectedDate.id);
      this.callGetSongSelectedByDateAPI(selectedDate.id);
      this.callGetServantByDateAPI(selectedDate.id);
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
                          servantList = { this.state.servantList }
                          periodid = { this.state.periodid }
                          periodDates = { this.state.periodDates }
                          periodName = { this.state.periodname }
                          periodDescr = { this.state.perioddescr }
                          churchRoles = { this.state.churchRoles }
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

export default MaintainSchedule;