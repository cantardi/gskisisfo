import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class MessageModal extends Component {
  
  render(){
    return (
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton><h4>{ this.props.headerText }</h4></Modal.Header>
          <Modal.Body>{ this.props.contentText }
            <div className="ma1">{ this.props.contentText1 }</div>
            <div className="ma1">{ this.props.contentText2 }</div>
            <div className="ma1 red">{ this.props.errorText }</div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide} >Close</Button>
          </Modal.Footer>
        </Modal>
    )
  }
  
}

export default MessageModal;