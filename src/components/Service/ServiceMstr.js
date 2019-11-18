import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav, Button } from "react-bootstrap";
import ServiceSong from './ServiceSong';
import ServiceServant from './ServiceServant';
import ServiceSermon from './ServiceSermon';
import { DateConvert } from '../../helpers/function';
import MessageModal from '../MessageModal';

class ServiceMstr extends Component {
  
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);

    const date = this.props.location.state

    this.state = {
      dateid: date.dateid,
      datevalue: date.datevalue,
      servantList: [],
      scheduledServants: [],
      realizedServants: [],
      songList: [], 
      scheduledSongs: [],
      selectedSongs: [],
      realizedSongs: [],
      churchRoles: [],
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
    }

  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
  }
  
  callGetChurchRoleAPI = () => {
    
    fetch('https://gskisisfobackend.herokuapp.com/getchurchrole/', {
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

  callGetServantAPI = () => {
    fetch('https://gskisisfobackend.herokuapp.com/getservant', {
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

  callGetSongByDateAPI = (dateid) => {
    
    fetch('https://gskisisfobackend.herokuapp.com/getsongbydate/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ scheduledSongs: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getsongbydate API: ' + err))

  }

  removeSong = (songid) => {
    const { realizedSongs } = this.state;
    
    let newSelectedSongs = realizedSongs.filter(newArray => newArray.songid !== songid )
    this.setState({ realizedSongs: newSelectedSongs });
  }

  addSong = (song) => {
    const { realizedSongs } = this.state;
    let songid = song.songid
    let dateid = this.state.dateid
    
    let addedSong = {dateid, songid}
    
    if (this.validateSong(addedSong).length > 0){
      alert('Song already exists')
    }
    else{
      realizedSongs.push(addedSong);
      this.setState({ realizedSongs }); 
    }
  }

  validateSong(song) {
    return this.state.realizedSongs
      .filter(realizedSongs => realizedSongs.songid===song.songid)
  }

  updateServantList = (event, roleid) => {
    
    let { realizedServants, scheduledServants } = this.state

    let updatedServant = {
      dateid: this.state.dateid,
      roleid: roleid,
      servantid: Number(event.target.value),
    }

    let foundIndex = realizedServants.findIndex(servant => servant.roleid === roleid)
    //realizedServants = realizedServants.splice(foundIndex, 1, updatedServant)
    
    console.log(scheduledServants)
    console.log(realizedServants)
    console.log(updatedServant)

    //this.setState({ realizedServants });

  }

  callGetSelectedSongByDateAPI = (dateid) => {

    fetch('https://gskisisfobackend.herokuapp.com/getselectedsongbydate/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => {
          this.setState({ selectedSongs: data, realizedSongs: data })
        })
      }
    }) 
    .catch(err => console.log('Fail to call getselectedsongbydate API: ' + err))

  }

  callGetServantByDateAPI = (dateid) => {

    fetch('https://gskisisfobackend.herokuapp.com/getservantbydate/'+dateid, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ scheduledServants: data, realizedServants: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getservantbydate API: ' + err))

  }

  componentDidMount(){
    this.callGetChurchRoleAPI();
    this.callGetSongByDateAPI(this.state.dateid);
    this.callGetServantByDateAPI(this.state.dateid);
    this.callGetSelectedSongByDateAPI(this.state.dateid);
    this.callGetServantAPI();
  }

	render(){
    
		return (
			<Container className="ma2">

        <h1>Service Details - { DateConvert(new Date(this.state.datevalue)) }</h1>
        
        <br/>

        <Row >
          <Col className="tr">
            <Button className="ma1" onClick={ this.saveService }>
              Save
            </Button> 
            <Button className="ma1" onClick={ ()=>this.props.history.push('/ServiceLP') }>  
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
                  <Nav.Link eventKey="first">Song Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Servant Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Sermon Details</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col sm={9}>
              <Tab.Content>
                
                <Tab.Pane eventKey="first">
                  {
                    this.state.scheduledSongs.length > 0?
                    (
                      <ServiceSong 
                        scheduledSongs = { this.state.scheduledSongs }
                        selectedSongs = { this.state.selectedSongs }
                        realizedSongs = { this.state.realizedSongs }
                        removeSong = { this.removeSong }
                        addSong = { this.addSong }
                      />
                    ):
                    (
                      <div className="alert alert-info" role="alert">
                        Servant has not been scheduled for this date.
                      </div>
                    )
                  }
                </Tab.Pane>

                <Tab.Pane eventKey="second">
                  {
                    this.state.scheduledServants.length > 0?
                    (
                      <ServiceServant 
                        churchRoles = { this.state.churchRoles }
                        scheduledServants = { this.state.scheduledServants }  
                        servantList = { this.state.servantList }  
                        realizedServants = { this.state.realizedServants }
                        updateServantList = { this.updateServantList }
                      />
                    ):
                    (
                      <div className="alert alert-info" role="alert">
                        Servant has not been scheduled for this date.
                      </div>
                    )
                  }
                </Tab.Pane>
                
                <Tab.Pane eventKey="third">
                  <ServiceSermon
                    churchRoles = { this.state.churchRoles }
                    scheduledServants = { this.state.scheduledServants }  
                    servantList = { this.state.servantList }  
                  />
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

export default ServiceMstr;