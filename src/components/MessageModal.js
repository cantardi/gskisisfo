import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class MessageModal extends Component {
  render(){
    return (
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton><h4>{ this.props.header }</h4></Modal.Header>
          <Modal.Body>{ this.props.errmsg }</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
    )
  }
  
}

export default MessageModal;