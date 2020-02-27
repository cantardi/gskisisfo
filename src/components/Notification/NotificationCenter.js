import React, { Component } from "react";
import { Form, Container, Col, Button, Alert, Row } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { history } from '../../helpers/function';
import { callGetNotifPeriodDateAPI, callGetServantEmailByDateAPI } from '../../helpers/apicall';
import NotifyServantModal from '../_reusables/R_NotifyServantModal';
import MessageModal from '../MessageModal';

class NotificationCenter extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      notifType: '',
      displayedDates: [],
      selectedDate: '',      
      notifyModalShow: false,
      notifyServantList: [],
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
      variant: '',
      formErrorMsg: ''
    }
    
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  handleTypeChange = (e) => {
    this.setState({ notifType: Number(e.target.value), selectedDate: '', variant: '', formErrorMsg: '' });
    
    callGetNotifPeriodDateAPI()
    .then(
      data => {
        let result = []
        data.map(dateList => result.push(new Date(dateList.predefineddate)) )
        this.setState({ displayedDates: result })
      },
      error => this.setState({ selectedDate: '', displayedDates: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }
 
  handleDateChange = (e) => {
    this.setState({ selectedDate: e.target.value, variant: '', formErrorMsg: '' });
  } 

  loadServantToNotify = () => {    

    const emailtype = this.state.notifType
    const selectedDate = this.state.selectedDate

    callGetServantEmailByDateAPI(emailtype, selectedDate)
    .then(
      data => this.setState({ notifyServantList: data, notifyModalShow: true }),
      error => console.log(error.message)
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  notifyModalClose = () => {
    this.setState({ notifyModalShow: false })
  }

  handleServantSelection = (e, id) => {
    const { notifyServantList } = this.state;

    let foundIndex = notifyServantList.findIndex(servant => servant.id === id)

    let updateNotifyList = Object.assign({}, notifyServantList[foundIndex])
    updateNotifyList.notifyflag = e.target.checked;

    notifyServantList.splice(foundIndex, 1, updateNotifyList)
    this.setState({ notifyServantList });
  }

  validateForm = () => {

    const { selectedDate, notifType } = this.state

    if (selectedDate === '' || notifType === '') {
      const text = "One or more input fields are not completed in the form. Please complete all fields with asterisk (*) in the form in order to save."
      this.setState({ variant: 'danger', formErrorMsg: text })
      return false
    }
    else {
      return true
    }

  }

  sendNotification = () => {
    if (this.validateForm() === true){
      if (window.confirm('Are you sure to submit this notification process? Email will be sent after you click OK.')) {
        this.callNotifyServantAPI();
      }
    }
  }

  callNotifyServantAPI = () => {
  
    const finalnotifylist = []

    this.state.notifyServantList
    .filter(servant => (servant.notifyflag === true || servant.notifyflag === '1'))
    .map(servant => finalnotifylist.push(servant))
  
    fetch(process.env.REACT_APP_BACKEND_URL + '/sendreminderemail', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servicedate: this.state.selectedDate,
        recipientList: finalnotifylist,
        emailtype: Number(this.state.notifType)
      })
    })
    .then (response => {
      if (response.status === 200){
        response.json()
        .then(data => alert(data))
      }
    }) 
    .then(this.setState({ notifyModalShow: false }))
    .catch(err => console.log("Fail to call sendscheduleemail API --- " + err))     
  
  }

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render() {
    
    return ( 
      <Container className="pa2">   
        
        <h1>Notification Center</h1>
        
        <br/>

        <Form.Group>
          <Form.Label>Notification Type*</Form.Label>
          <Form.Control 
            as="select" 
            name="notifType"
            value={ this.state.notifType }
            onChange={ this.handleTypeChange }
          >
            <option key="0" value="0">Select Type</option>
            <option key="1" value="1">Upcoming Service Reminder</option>
            <option key="2" value="2">Song Selection Reminder</option>
          </Form.Control>
        </Form.Group>
  
        <Form.Group>
          <Form.Label>Date*</Form.Label>
          <Form.Control 
            as="select" 
            name="selectedDate"
            value={ this.state.selectedDate }
            onChange={ this.handleDateChange }
          >
            <option key="0" value="">Select Date</option>
            {
              this.state.displayedDates.length > 0 &&
              this.state.displayedDates.map((date, i) => 
                <option key={ i } value={ new Date(date) }>
                  { DateConvert(new Date(date)) }
                </option>
              )
            }
          </Form.Control>
        </Form.Group>

        <Alert className="mt2 mb2" variant={ this.state.variant }>{ this.state.formErrorMsg }</Alert>

        <Row>
          <Col className="tr">
            <Button bsPrefix="btn-custom" className="ma1" onClick={ this.loadServantToNotify }> 
              Verify Recipients
            </Button>  
            <Button bsPrefix="btn-custom" className="ma1" onClick={ ()=>history.push('/Administration') }>
              Cancel
            </Button> 
          </Col>
        </Row>
  
        <NotifyServantModal
          show={ this.state.notifyModalShow }
          onHide={ this.notifyModalClose }
          notifyServantList={ this.state.notifyServantList }
          handleServantSelection = {this.handleServantSelection}
          sendNotification = {this.sendNotification}
        />

        <MessageModal
            show={ this.state.msgModalShow }
            onHide={ this.msgModalClose }
            headerText={ this.state.msgModalHeader }
            contentText1={ this.state.msgModalContent }
        />
          
      </Container> 
      )
  }
}
 
export default NotificationCenter;