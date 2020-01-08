import React, { Component } from 'react';
import { Container, Table, Button, Row, Col, Alert } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { history } from '../../helpers/function';
import ServantPdf from './R_ServantPdf';
import ScheduleServantEditModal from './R_ScheduleServantEditModal';
import NotifyServantModal from './R_NotifyServantModal';

class ScheduleServant extends Component {

  constructor(props){
    super(props)
    this.state = {
      notifyModalShow: false,
      notifyServantList: [],
      fileattachment: '',
      editServantSchedModalShow: false,
      addedSchedule: [],
      deletedSchedule: []
    }
  }

  returnServantName = (dateid, roleid) => {
    const servant = this.props.servantSchedule
                    .filter(schedule => Number(schedule.dateid) === dateid)
                    .filter(schedule => Number(schedule.roleid) === roleid)
                  
    if (servant.length > 0) return servant[0].servantname
    else return '-'

  }
   
  editServantSchedModalClose = () => {
    this.setState({ editServantSchedModalShow: false })
  }

  editSchedule = () => {
    this.setState({ editServantSchedModalShow: true })
  }
  
  loadServantToNotify = () => {    
    this.callGetServantEmailAPI();
    this.setState({ notifyModalShow: true })    
  }

  handleServantSelection = (e, id) => {
    const { notifyServantList } = this.state;

    let foundIndex = notifyServantList.findIndex(servant => servant.id === id)

    let updateNotifyList = Object.assign({}, notifyServantList[foundIndex])
    updateNotifyList.notifyflag = e.target.checked;

    notifyServantList.splice(foundIndex, 1, updateNotifyList)
    this.setState({ notifyServantList });
  }

  sendNotification = () => {
    
    pdf(<ServantPdf periodDates={this.props.periodDates} 
      periodName={this.props.periodName}
      periodDescr={this.props.periodDescr}
      churchRoles={this.props.churchRoles}
      returnServantName={this.returnServantName} />)
      .toBlob()
      .then(data => {
        var reader = new FileReader();
        var base64data = ''
        if (data.type === 'application/pdf') {
          reader.readAsDataURL(data); 
          reader.onloadend = () => {
            base64data = reader.result.substr(reader.result.indexOf(',') + 1);           
            this.setState({ fileattachment: base64data }, ()=>this.callNotifyServantAPI() )
          }
        }
      });

    this.notifyModalClose();
  }

  notifyModalClose = () => {
    this.setState({ notifyModalShow: false })
  }

  callGetServantEmailAPI = () => {

    const servantIdArray = []
    this.props.servantSchedule.map(servant => servantIdArray.push(servant.servantid))
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getservantemail', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servantids: servantIdArray
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ notifyServantList: data }))
      }
    }) 
    .catch(err => console.log("Fail to call getservantemail API: " + err))     
  }

  callNotifyServantAPI = () => {
  
    const finalnotifylist = []

    this.state.notifyServantList
    .filter(servant => (servant.notifyflag === true || servant.notifyflag === '1'))
    .map(servant => finalnotifylist.push(servant))
  
    fetch(process.env.REACT_APP_BACKEND_URL + '/sendscheduleemail', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        notifylist: finalnotifylist,
        fileattachment: this.state.fileattachment,
        period: this.props.periodDescr
      })
    })
    .then (response => {
      if (response.status === 200){
        response.json()
        .then(data => alert(data))
      }
    }) 
    .catch(err => console.log("Fail to call sendscheduleemail API --- " + err))     
  
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
              document={ <ServantPdf periodDates={ this.props.periodDates } 
                          periodName={ this.props.periodName }
                          periodDescr={ this.props.periodDescr }
                          churchRoles={ this.props.churchRoles }
                          returnServantName={ this.returnServantName }
                        />} 
              fileName={`Servant_${this.props.periodName}.pdf`} 
            >
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
            </PDFDownloadLink>

            {
              this.props.notifyDisplayFlag === true?
              (
                <Button className="ma1" onClick={ this.loadServantToNotify }>
                  Notify
                </Button> 
              ):
              (
                null
              )
            }
            
            <Button className="ma1" onClick={ ()=>history.push(this.props.PAGE_PARENT) }>  
              Return to Search
            </Button>

          </Col>
        </Row>

        <div className="tc mt2" id="servantschedulearea">

          <Alert variant="info" className="mb2">
            <h4>{ this.props.periodName } ({ this.props.periodDescr })</h4>
          </Alert>

          {
            this.props.periodDates.map(date => {
              return(
                <Col 
                  key={ "date-"+date.id }
                  md={5}
                  className='t v-top dib br3 ma2 shadow-2'
                > 
                  <h4 className="pa2 tc">
                    { DateConvert(new Date(date.predefineddate)) }
                  </h4>

                  <Table size="sm" responsive className="f6 tl">
                    <tbody>
                    {
                      this.props.churchRoles.length > 0 &&
                      this.props.churchRoles.map(role => {
                        return(
                          <tr key={ "role-"+role.id }>
                            <th className="w-50">
                              { role.description }
                            </th>
                            
                            <td className="w-50">
                            {
                              this.returnServantName(date.id, role.id)
                            }
                            </td>
                          </tr>
                        )   
                      })
                    }
                    </tbody>
                  </Table>
                </Col>
              )
            })
          }
        </div>

        <ScheduleServantEditModal
          show={ this.state.editServantSchedModalShow }
          onHide={ this.editServantSchedModalClose }
          displayedDates={ this.props.periodDates }
          selectedServants={ this.props.servantSchedule }
          servantList = { this.props.servantList }
          periodid = { this.props.periodid }
          churchRoles = { this.props.churchRoles }
          reloadData = { this.props.reloadData }
        />

        <NotifyServantModal
          show={ this.state.notifyModalShow }
          onHide={ this.notifyModalClose }
          notifyServantList={ this.state.notifyServantList }
          handleServantSelection = {this.handleServantSelection}
          sendNotification = {this.sendNotification}
        />

			</Container>					
		);
	}
	
}

export default ScheduleServant;