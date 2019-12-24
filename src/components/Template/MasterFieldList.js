import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Alert, Button, Modal, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { MdClose, MdAddCircleOutline } from 'react-icons/md';
import MessageModal from "../MessageModal";

class MasterFieldList extends Component {
  
  constructor(props){

    super(props);
    
    this.state = {
      masterFields: [],
      newFieldName: '',
      addedField: [],
      deletedField: [],
      msgModalShow: false,
      msgModalHeader: '', 
      msgModalContent: '',
      errorText: '',
      variant: '',
      fieldModalShow: false,
      btnSaveDisabled: true,
    }
  }
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  fieldModalClose = () => {
    this.setState({ fieldModalShow: false })
  } 

  enableSaveButton() {
    if (this.state.btnSaveDisabled === true){
      this.setState({ btnSaveDisabled: false })  
    }
  }

  addField = () => {
    
    if (this.state.newFieldName !== ''){
      const { masterFields, addedField } = this.state;

      let existingIdArray = []
      let maxId = ''
      let newAddedList = masterFields.filter(field => field.id.toString().includes('n'))

      if (newAddedList.length === 0) {
        existingIdArray.push(0)
      }          
      else {
        newAddedList.map(field => existingIdArray.push( Number(field.id.toString().substring(1, field.id.length)) ))
      }        

      maxId = Math.max(...existingIdArray)

      let newField = { id: 'n'+(maxId+1), fieldname: this.state.newFieldName }

      masterFields.push(newField);
      addedField.push(newField);

      this.setState({ masterFields });
      this.setState({ addedField });

      this.setState({ newFieldName: '', errorText: '', variant: '' });
      this.setState({ fieldModalShow: false })  

      this.enableSaveButton();
    }
    else{
      this.setState({ variant: 'danger', errorText: "Field name is empty. Please fill in the name to proceed." })
    }

  }

  removeField = (objid) => {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      const { masterFields, deletedField, addedField } = this.state;

      if (objid.toString().substring(0,1)!=='n') {
        deletedField.push(objid);
        this.setState({ deletedField });  
      }

      let newFieldList = masterFields.filter(newArray => newArray.id !== objid )
      let newAddedFieldList = addedField.filter(newArray => newArray.id !== objid )
      
      this.setState({ masterFields: newFieldList });
      this.setState({ addedField: newAddedFieldList });

      this.enableSaveButton();
    }
  }

  callAddFieldAPI = () => {
    const { addedField } = this.state;
    
    let newFieldName = []
    addedField.map(field => newFieldName.push(Object ({fieldname: field.fieldname}) ))

    fetch(process.env.REACT_APP_BACKEND_URL + '/addmasterfield', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        newfield: newFieldName
      })
    })
    .then(response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    })
    .catch(err => console.log("Fail to call addmasterfield API: " + err))
  }

  callDeleteFieldAPI = () => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/deletemasterfield', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        deletedfield: this.state.deletedField
      })
    })
    .then(response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    })
    .catch(err => console.log("Fail to call deletemasterfield API: " + err))
    
  }

  saveField = () => {

    if (this.state.addedField.length > 0){
      this.callAddFieldAPI();
      this.setState({ addedField: [] })
    }

    if (this.state.deletedField.length > 0){
      this.callDeleteFieldAPI();
      this.setState({ deletedField: [] })
    }
    
    this.setState({ btnSaveDisabled: true })
  }

  componentDidMount(){
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getmasterfield', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ masterFields: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getmasterfield API: ' + err))

  }

  render() {   
    
    return (
      <Container className="pa2">
          
        <h1>Setup Master Field List</h1>

        <Row>
          <Col className="tr">
            <Button className="ma1" 
                    onClick={ this.saveField }
                    disabled={ this.state.btnSaveDisabled }
            >  
              Save
            </Button> 
            <Button className="ma1" onClick={ ()=>this.props.history.push('/Administration') }>  
              Cancel
            </Button> 
          </Col>
        </Row>

        {
          this.state.masterFields.length > 0 &&
          this.state.masterFields.map((field, i) => {
            return (
              <div 
                key={ i }
                className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
              >
              { field.fieldname }
                <MdClose 
                  className="ml2 pointer dim"
                  onClick={ ()=>this.removeField(field.id) }
                />
              </div>
            )
          })
        }

        <div className="tc v-top dib br3 pa3 ma2 bw2 shadow-2">
          <MdAddCircleOutline 
            size={20} 
            className="pointer dim" 
            onClick={ ()=>this.setState({ fieldModalShow: true }) }
          />
        </div>

        <Modal show={this.state.fieldModalShow} onHide={this.fieldModalClose} size="lg">
          <Modal.Header closeButton><h4>Input New Field</h4></Modal.Header>
          <Modal.Body className="tc">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Field Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Enter field name here"
                name="newFieldName"
								onChange={ this.handleChange } 
              />
            </InputGroup>
            <Alert variant={this.state.variant}>{ this.state.errorText }</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.addField }>OK</Button>
          </Modal.Footer>
        </Modal>

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

export default MasterFieldList;