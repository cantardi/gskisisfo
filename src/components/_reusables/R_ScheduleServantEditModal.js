import React, { Component } from 'react';
import { Table, FormControl, Modal, Button } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import MessageModal from '../MessageModal';

class ServantScheduleEditModal extends Component {

  constructor(props){
    super(props);

    this.state = {
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      currentdateid: '',
      selectedServants: this.props.selectedServants,
      addedSchedule: [],
      deletedSchedule: [],
    }
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  disableField = (predefineddate) => {
    if (new Date(predefineddate).getTime() < new Date().getTime() ){
      return true
    }
    else {
      return false
    }
  }

  disableSaveButton() {
    const { addedSchedule, deletedSchedule } = this.state

    if (addedSchedule.length > 0 || deletedSchedule.length > 0) {
      return false
    }
    else {
      return true
    }
  }

  returnServantID = (roleid, dateid) => {
    const servant = this.state.selectedServants
                    .filter(schedule => Number(schedule.roleid) === roleid)
                    .filter(schedule => Number(schedule.dateid) === dateid)
                  
    if (servant.length > 0) return servant[0].servantid
    else return ''

  }

  saveEditedSchedule = () => {
    const { addedSchedule, deletedSchedule } = this.state

    if (addedSchedule.length > 0){
      this.callAddServantSchedAPI();
    }

    if (deletedSchedule.length > 0){
      this.callDeleteServantSchedAPI();
    }
    
    this.props.reloadData(this.props.periodid)
  }

  callAddServantSchedAPI = () => {
    
    const finalAddLists = this.state.addedSchedule.map(servant =>
      ({
        periodid: this.props.periodid,
        dateid: servant.dateid,
        roleid: servant.roleid,
        servantid: servant.servantid
      })
    )
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/addservantschedule', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        servantSchedule: finalAddLists
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, addedSchedule: [] }, this.props.onHide()))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data, addedSchedule: [] }, this.props.onHide()))
      }
    }) 
    .catch(err => console.log('Fail to call addservantschedule API --- ' + err))

  }

  callDeleteServantSchedAPI = () => {
    
    const { deletedSchedule } = this.state

    fetch(process.env.REACT_APP_BACKEND_URL + '/deleteservantschedule', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        deletedLists: deletedSchedule
      })
    })
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, deletedSchedule: [] }, this.props.onHide()))
        }
        else { 
          return response.json()
          .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data, deletedSchedule: [] }, this.props.onHide()))
        }
      }) 
      .catch(err => console.log('Fail to call deleteservantschedule API --- ' + err))
  }

  validateServant(servant) {
    return this.state.selectedServants
      .filter(selectedServant => selectedServant.dateid === servant.dateid && selectedServant.servantid === servant.servantid)
  }

  updateServantList = (e, roleid, dateid) => {
    
    const { selectedServants, addedSchedule, deletedSchedule } = this.state
    
    const modifiedServant = {
      dateid: dateid,
      roleid: roleid,
      servantid: Number(e.target.value),
    }

    if (this.validateServant(modifiedServant).length > 0 && Number(e.target.value) !== 0){
      alert('Servant is already tagged to other role. Please select another person')
    }
    else {
      let foundIndex = selectedServants.findIndex(servant => servant.dateid === dateid && servant.roleid === roleid)
                    
      if (foundIndex === -1){
        selectedServants.push(modifiedServant)
        addedSchedule.push(modifiedServant)
      }
      else {
        if (typeof selectedServants[foundIndex].id !== 'undefined') deletedSchedule.push(selectedServants[foundIndex].id)
        selectedServants.splice(foundIndex, 1, modifiedServant)
        if (Number(e.target.value) !== 0) addedSchedule.push(modifiedServant)
      }
           
      this.setState({ selectedServants, addedSchedule, deletedSchedule })
    }
  }

  render() {

    return (
      <Modal show={ this.props.show } onHide={ this.props.onHide } size="xl">

        <Modal.Header closeButton><h4>Edit Servant Schedule</h4></Modal.Header>
        
        <Modal.Body>
          
          <div className="alert alert-info" role="alert">
            Update the song schedule as required. Past schedule will be disabled for data integrity purpose.
          </div>

          {
            this.props.displayedDates.map(date => {
            return (
              <Table key={ 'tbl'+date.id } responsive>            
                <thead>
                  <tr>
                    <th key={ 'th'+date.id }>
                      { DateConvert(new Date(date.predefineddate)) } 
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr> 
                    <td>
                    {
                      this.props.churchRoles.length > 0 &&
                      this.props.churchRoles.map(role => {
                        return(
                          <div 
                            key={ date.id + "-" + role.id }
                            className="tc v-top dib br3 pa2 ma1 bw2 shadow-1"
                          >
                            { role.description }
                            <FormControl
                              as="select"
                              disabled={ this.disableField(date.predefineddate) }
                              value={ this.returnServantID(role.id, date.id) }
                              onChange={ (e)=>this.updateServantList(e, role.id, date.id) }
                            >
                              <option key="0" value="">Choose...</option>
                              {
                                this.props.servantList.map(servant => 
                                  <option key={ servant.id } value={ servant.id }>
                                    { servant.servantname }
                                  </option>
                                )
                              }
                            </FormControl>
                          </div>
                        )   
                      })
                    }
                    </td>
                  </tr>
                </tbody>
              </Table>
              )
            })
          }

          <MessageModal
            show={ this.state.msgModalShow }
            onHide={ this.msgModalClose }
            headerText={ this.state.msgModalHeader }
            contentText1={ this.state.msgModalContent }
          />

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={ this.saveEditedSchedule } disabled={ this.disableSaveButton() }>Save</Button>
          <Button onClick={ this.props.onHide }>Cancel</Button>
        </Modal.Footer>
        
      </Modal>	
    )
  }
  
}
 
export default ServantScheduleEditModal;

