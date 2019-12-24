import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";

class ServantNotifyModal extends Component {
  
  render(){
    return (
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton><h4>Select Servant to Notify</h4></Modal.Header>
          <Modal.Body>
            <Form.Group id="formGridCheckbox">
            {
              this.props.notifyServantList.length > 0 &&
              this.props.notifyServantList.map(servant => {
                return (
                  <Form.Check 
                    key={servant.id}
                    label={`${servant.servantname} - ${servant.email}`}
                    name="schedulingflag"
                    checked={ servant.notifyflag }
                    onChange={ (e) => this.props.handleServantSelection(e, servant.id) }
                  />
                )
              })
            }
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.sendNotification}>Submit</Button>
          </Modal.Footer>
        </Modal>
    )
  }
  
}

export default ServantNotifyModal;