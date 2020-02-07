import React, { Component } from 'react';
import { Container, Form, Row, Col, Alert, Button, Table, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { callGetMasterFieldAPI, callGetFieldDetailsAPI, callAddFieldValueAPI, callDeleteFieldValueAPI, callUpdateFieldValueAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function'
import MessageModal from '../MessageModal';

class MasterDataLP extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      masterFields: [],
      fieldId: '',
      fieldDetails: [],
      newDescription: '',
      newShortDescr: '',
      addFor: '',
      addedFieldValues: [],
      deletedFieldValues: [],
      updateFlag: false,
      fieldModalShow: false,
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
      btnSaveDisabled: true,
      errorText: '',
      variant: '',
    }
  }

  enableSaveButton() {
    if (this.state.btnSaveDisabled === true){
      this.setState({ btnSaveDisabled: false })  
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, variant: '', errorText: '' });
  }

  handleFieldChange = (e) => {
    if (this.state.addedFieldValues.length > 0 || this.state.deletedFieldValues.length > 0 || this.state.updateFlag){
      if (window.confirm('Are you sure you wish to change the field. You have unsaved items currently. Changes will be removed once you click OK')){
        this.setState({ fieldDetails: [], addedFieldValues: [], deletedFieldValues: [], updateFlag: false })
        this.setState({ fieldId: e.target.value, addFor: e.target.options[e.target.selectedIndex].text }, () => this.getMasterFieldValue(this.state.fieldId) );
      }
    }
    else {
      this.setState({ fieldDetails: [] })
      this.setState({ fieldId: e.target.value, addFor: e.target.options[e.target.selectedIndex].text }, () => this.getMasterFieldValue(this.state.fieldId) );
    }
  }

  handleDescrChange = (e, fieldValueId) => {
    const { fieldDetails } = this.state
    const updatedDescr = e.target.value

    const updatedField = fieldDetails.filter(field => field.id === fieldValueId)
    updatedField[0].description = updatedDescr
    updatedField[0].flag = true
    this.updateFieldValue(updatedField[0], fieldValueId)
    
  }

  handleShortDescrChange = (e, fieldValueId) => {
    const { fieldDetails } = this.state
    const updatedShortDescr = e.target.value

    const updatedField = fieldDetails.filter(field => field.id === fieldValueId)
    updatedField[0].shortdescr = updatedShortDescr
    updatedField[0].flag = true
    this.updateFieldValue(updatedField[0], fieldValueId)
  }

  updateFieldValue = (updatedfield, fieldid) => {
    const { fieldDetails } = this.state

    const updatedIndex = fieldDetails.map(field => field.id).indexOf(fieldid);
    fieldDetails.splice(updatedIndex , 1, updatedfield)
    
    this.setState({ fieldDetails, updateFlag: true, variant: '', errorText: '' })
    
    this.enableSaveButton();
  }

  addFieldValue = () => {

    const { fieldDetails, addedFieldValues, newDescription, newShortDescr } = this.state;

    if (newDescription !== '' && newShortDescr !== ''){
      
      let existingIdArray = []
      let maxId = ''

      let prevAddedFieldValue = fieldDetails.filter(field => field.id.toString().includes('n'))

      if (prevAddedFieldValue.length === 0) {
        existingIdArray.push(0)
      }          
      else {
        prevAddedFieldValue.map(field => existingIdArray.push( Number(field.id.toString().substring(1, field.id.length)) ))
      }        

      maxId = Math.max(...existingIdArray)

      let newFieldValue = { 
        fieldname: this.state.addFor,
        id: 'n'+(maxId+1), 
        fieldid: this.state.fieldId,
        status: 'A',
        description: this.state.newDescription,
        shortdescr: this.state.newShortDescr,
        flag: false
      }

      fieldDetails.push(newFieldValue);
      addedFieldValues.push(newFieldValue);

      this.setState({ fieldDetails });
      this.setState({ addedFieldValues });
      this.setState({ newDescription: '', newShortDescr: '' })
      this.setState({ fieldModalShow: false })  
      this.enableSaveButton();

    }
    else {
      this.setState({ variant: 'danger', errorText: "Field description/short description is empty. Please fill in the name to proceed." })
    }
    
  }

  removeFieldValue = (objid) => {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      const { fieldDetails, deletedFieldValues, addedFieldValues } = this.state;

      if (objid.toString().substring(0,1)!=='n') {
        deletedFieldValues.push(objid);
        this.setState({ deletedFieldValues });  
      }

      let newFieldDetails = fieldDetails.filter(newArray => newArray.id !== objid )
      let newAddedFieldValues = addedFieldValues.filter(newArray => newArray.id !== objid )
      
      this.setState({ fieldDetails: newFieldDetails });
      this.setState({ addedFieldValues: newAddedFieldValues });
      this.enableSaveButton();

    }
  }

  saveMasterFieldValue = () => {

    if (this.state.addedFieldValues.length > 0){

      const { addedFieldValues } = this.state;
  
      let newFieldValue = []
      addedFieldValues.map(newvalue => newFieldValue.push(Object ({fieldid: newvalue.fieldid, status: newvalue.status, description: newvalue.description, shortdescr: newvalue.shortdescr}) ))
      
      callAddFieldValueAPI(newFieldValue)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, addedFieldValues: [] }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message, addedFieldValues: [] })
      )
      .then(() => this.getMasterFieldValue(this.state.fieldId) )
      .catch(err => console.log("Fail to call API due to: " + err))

    }

    if (this.state.deletedFieldValues.length > 0){

      const { deletedFieldValues } = this.state

      callDeleteFieldValueAPI(deletedFieldValues)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, deletedFieldValues: [] }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message, deletedFieldValues: [] })
      )
      .then(() => this.getMasterFieldValue(this.state.fieldId) )
      .catch(err => console.log("Fail to call API due to: " + err))

    }
    
    if (this.state.updateFlag){
      
      const { fieldDetails } = this.state
      const updatedFieldRows = fieldDetails.filter(field => field.flag === true)

      callUpdateFieldValueAPI(updatedFieldRows)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data, updateFlag: false, fieldDetails: [] }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message, updateFlag: false })
      )
      .then(() => this.getMasterFieldValue(this.state.fieldId) )
      .catch(err => console.log("Fail to call API due to: " + err))

    }

    this.setState({ btnSaveDisabled: true })

  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  fieldModalClose = () => {
    this.setState({ fieldModalShow: false })
  }

  getMasterFieldValue = (fieldId) => {

    callGetFieldDetailsAPI(fieldId)
    .then(
      data => this.setState({ fieldDetails: data }),
      error => this.setState({ fidleDetails: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  componentDidMount(){

    callGetMasterFieldAPI()
    .then(
      data => this.setState({ masterFields: data }),
      error => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  render() {
    
    return (
      <Container className="pa2">

        <h1>Setup Master Data</h1>
        
        <Row>
          <Col className="tr">
            <Button className="ma1" bsPrefix="btn-custom" onClick={ this.saveMasterFieldValue } disabled={ this.state.btnSaveDisabled }>
              Save
            </Button> 
            <Button className="ma1" bsPrefix="btn-custom" onClick={ ()=>history.push('./Administration') }>  
              Cancel
            </Button> 
          </Col>
        </Row>

        <br/>

        <Form>
          <Form.Group as={Row} controlId="formFieldName">
						<Form.Label column md={2} className="ma1">Field Name</Form.Label>
						<Col md={6}>
							<Form.Control 
								as="select"  
								name="searchFieldName"
								value={ this.state.fieldId } 
                onChange={ this.handleFieldChange }
                className="ma1"
							>
                <option key="0" value="">--Select--</option>
                {
                  this.state.masterFields.length > 0 &&
                  this.state.masterFields.map(field => {
                    return (
                      <option key= { field.id } 
                              value={ field.id }>
                        { field.fieldname }
                      </option>
                    )
                  })
                }
							</Form.Control>
						</Col>
            <Col md={2}>
            {
              this.state.fieldId !== ''
              ?
              <Button bsPrefix="btn-custom" className="ma1" onClick={ ()=>this.setState({ fieldModalShow: true }) } >
                Add
              </Button>
              :
              null
            }
            </Col>
					</Form.Group>
        </Form>        
        
        <Table responsive>
          <thead>
            <tr>
              <th className="w-5">#</th>
              <th className="w-55">Description</th>
              <th className="w-30">Legend</th>
              <th className="w-10">&nbsp;</th>
            </tr>
          </thead>
          
          <tbody>
          {
            this.state.fieldDetails.length > 0 && 
            this.state.fieldDetails.map((fieldDetail, i) => {
              return(
                <tr key= {fieldDetail.id}>
                  <td className="w-5 ma1">{ i+1 }</td>
                  <td className="w-55">
                    <FormControl 
                      name="descriptionText"
                      value={ fieldDetail.description } 
                      className="ma1"
                      onChange={ (e)=>this.handleDescrChange(e, fieldDetail.id) }>  
                    </FormControl>
                  </td>
                  <td className="w-30">
                    <FormControl 
                      name="shortdescrText"
                      value={ fieldDetail.shortdescr }
                      className="ma1"
                      onChange={ (e)=>this.handleShortDescrChange(e, fieldDetail.id) }>
                    </FormControl>
                  </td>
                  <td className="w-10">
                  <Button bsPrefix="btn-custom" className="ma1" onClick={ ()=>this.removeFieldValue(fieldDetail.id) } >
                    Remove
                  </Button>              
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>

        <Modal show={this.state.fieldModalShow} onHide={this.fieldModalClose} size="lg">
        <Modal.Header closeButton><h4>Input New Value: {this.state.addFor}</h4></Modal.Header>
          <Modal.Body className="tc">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Description</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Enter field description here"
                name="newDescription"
								onChange={ this.handleInputChange } 
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Short Description</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Enter field short description here"
                name="newShortDescr"
								onChange={ this.handleInputChange } 
              />
            </InputGroup>
            <Alert variant={this.state.variant}>{ this.state.errorText }</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button bsPrefix="btn-custom" onClick={ this.addFieldValue }>OK</Button>
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

export default MasterDataLP;
