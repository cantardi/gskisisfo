import React, { Component } from 'react';
import { Modal, Table, Button, Form } from 'react-bootstrap';

class NotifyServantModal extends Component {
  
  render(){
    return (
      <Modal show={ this.props.show } onHide={ this.props.onHide }>
        <Modal.Header closeButton><h4>Notification</h4></Modal.Header>
        <Modal.Body>
          Select Servant to Notify <br/><br/>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
          
            <tbody>
            {
              this.props.notifyServantList.length > 0 &&
              this.props.notifyServantList.map(servant => {
                return (
                  <tr key={ "tr-"+servant.id }>
                    <td>
                      <Form.Check 
                        key={ servant.id }
                        label={ servant.servantname }
                        name="schedulingflag"
                        checked={ servant.notifyflag }
                        onChange={ (e) => this.props.handleServantSelection(e, servant.id) }
                      />
                    </td>
                    <td>{ servant.email }</td>
                  </tr>  
                )
                })
            }        
            </tbody>
          </Table>
          
        </Modal.Body>
        <Modal.Footer>
          <Button bsPrefix="btn-custom" onClick={ this.props.sendNotification }>Submit</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  
}

export default NotifyServantModal;