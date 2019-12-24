import React, { Component } from 'react';
import { Container, Form, Row, Col, Button, Table, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
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
    }
  }

  enableSaveButton() {
    if (this.state.btnSaveDisabled === true){
      this.setState({ btnSaveDisabled: false })  
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFieldChange = (e) => {
    if (this.state.addedFieldValues.length > 0 || this.state.deletedFieldValues.length > 0 || this.state.updateFlag){
      if (window.confirm('Are you sure you wish to change the field. You have unsaved items currently. Changes will be removed once you click OK')){
        this.setState({ fieldDetails: [], addedFieldValues: [], deletedFieldValues: [], updateFlag: false })
        this.setState({ fieldId: e.target.value, addFor: e.target.options[e.target.selectedIndex].text }, () => this.callGetFieldDetailsAPI() );
      }
    }
    else {
      this.setState({ fieldDetails: [] })
      this.setState({ fieldId: e.target.value, addFor: e.target.options[e.target.selectedIndex].text }, () => this.callGetFieldDetailsAPI() );
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
    
    this.setState({ fieldDetails, updateFlag: true })
    this.enableSaveButton();
  }

  addFieldValue = () => {
    const { fieldDetails, addedFieldValues } = this.state;

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
  
  callAddFieldValueAPI = () => {
    const { addedFieldValues } = this.state;
    
    let newFieldValue = []
    addedFieldValues.map(newvalue => newFieldValue.push(Object ({fieldid: newvalue.fieldid, status: newvalue.status, description: newvalue.description, shortdescr: newvalue.shortdescr}) ))
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/addfieldvalue', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        newvalues: newFieldValue
      })
    })
    .then(response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
        .then(this.callGetFieldDetailsAPI)
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    })
    .catch(err => console.log("Fail to call addfieldvalue API: " + err))
  }

  callDeleteFieldValueAPI = () => {

    fetch(process.env.REACT_APP_BACKEND_URL + '/deletefieldvalue', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        deletedvalues: this.state.deletedFieldValues
      })
    })
    .then(response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
        .then(this.callGetFieldDetailsAPI)
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    })
    .catch(err => console.log("Fail to call deletefieldvalue API: " + err))
  }

  callUpdateFieldValueAPI = () => {
    
    const { fieldDetails } = this.state
    const updatedFieldRows = fieldDetails.filter(field => field.flag === true)

    fetch(process.env.REACT_APP_BACKEND_URL + '/updatefieldvalue', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        updatedfields: updatedFieldRows,
      })
    })
    .then(response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
        .then(this.callGetFieldDetailsAPI)
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    })
    .catch(err => console.log("Fail to call updatefieldvalue API: " + err))
    
    fieldDetails.map(field => field.flag = false)
    this.setState({ fieldDetails })
  }

  callGetFieldDetailsAPI = () => {
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getfielddetails/' + this.state.fieldId, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ fieldDetails: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log("Fail to call getfielddetails API: " + err))

  }

  saveMasterFieldValue = () => {

    if (this.state.addedFieldValues.length > 0){
      this.callAddFieldValueAPI();
      this.setState({ addedFieldValues: [] })
    }

    if (this.state.deletedFieldValues.length > 0){
      this.callDeleteFieldValueAPI();
      this.setState({ deletedFieldValues: [] })
    }
    
    if (this.state.updateFlag){
      this.callUpdateFieldValueAPI();
      this.setState({ updateFlag: false })
    }

    this.setState({ btnSaveDisabled: true })
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  fieldModalClose = () => {
    this.setState({ fieldModalShow: false })
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

        <h1>Setup Master Data</h1>
        
        <Row>
          <Col className="tr">
            <Button className="ma1" onClick={ this.saveMasterFieldValue } disabled={ this.state.btnSaveDisabled }>
              Save
            </Button> 
            <Button className="ma1" onClick={ ()=>this.props.history.push('./Administration') }>  
              Cancel
            </Button> 
          </Col>
        </Row>

        <Form>
          <Form.Group as={Row} controlId="formFieldName">
						<Form.Label column md={3}>Field Name</Form.Label>
						<Col md={6}>
							<Form.Control 
								as="select"  
								name="searchFieldName"
								value={ this.state.fieldId } 
								onChange={ this.handleFieldChange }
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
            <Col md={1}>
            {
              this.state.fieldId !== ''
              ?
              <MdAddCircleOutline size={30} className="pointer" onClick={ ()=>this.setState({ fieldModalShow: true }) } /> 
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
              <th className="w-25">Field Name</th>
              <th className="w-45">Description</th>
              <th className="w-23">Legend</th>
              <th className="w-2">&nbsp;</th>
            </tr>
          </thead>
          
          <tbody>
          {
            this.state.fieldDetails.length > 0 && 
            this.state.fieldDetails.map((fieldDetail, i) => {
              return(
                <tr key= {fieldDetail.id}>
                  <td className="w-5">{ i+1 }</td>
                  <td className="w-25">{ fieldDetail.fieldname }</td>
                  <td className="w-45">
                    <FormControl 
                      name="descriptionText"
                      value={ fieldDetail.description } 
                      onChange={ (e)=>this.handleDescrChange(e, fieldDetail.id) }>  
                    </FormControl>
                  </td>
                  <td className="w-23">
                    <FormControl 
                      name="shortdescrText"
                      value={ fieldDetail.shortdescr } 
                      onChange={ (e)=>this.handleShortDescrChange(e, fieldDetail.id) }>
                    </FormControl>
                  </td>
                  <td className="w-2">
                    <MdRemoveCircleOutline size={30} className="pointer" onClick={ ()=>this.removeFieldValue(fieldDetail.id) } />
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
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.addFieldValue }>OK</Button>
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
