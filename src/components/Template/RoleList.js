import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Modal, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { MdClose, MdAddCircleOutline } from 'react-icons/md';
import MessageModal from "../MessageModal";

class RoleList extends Component {
  
  constructor(props){

    super(props);
    
    this.state = {
      roleList: [],
      newRoleName: '',
      addedRole: [],
      deletedRole: [],
      msgModalShow: false,
      msgModalHeader: '', 
      msgModalContent: '',
      roleModalShow: false,
      btnSaveDisabled: true,
    }
  }
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  roleModalClose = () => {
    this.setState({ roleModalShow: false })
  } 

  enableSaveButton() {
    if (this.state.btnSaveDisabled === true){
      this.setState({ btnSaveDisabled: false })  
    }
  }

  addRole = () => {
    const { roleList, addedRole } = this.state;

    let existingIdArray = []
    let maxId = ''
    let newAddedList = roleList.filter(role => role.id.toString().includes('n'))

    if (newAddedList.length === 0) {
      existingIdArray.push(0)
    }          
    else {
      newAddedList.map(role => existingIdArray.push( Number(role.id.toString().substring(1, role.id.length)) ))
    }        

    maxId = Math.max(...existingIdArray)

    let newRole = { id: 'n'+(maxId+1), rolename: this.state.newRoleName }

    roleList.push(newRole);
    addedRole.push(newRole);

    this.setState({ roleList });
    this.setState({ addedRole });
    this.setState({ roleModalShow: false })  

    this.enableSaveButton();

  }

  removeRole = (objid) => {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      const { roleList, deletedRole, addedRole } = this.state;

      if (objid.toString().substring(0,1)!=='n') {
        deletedRole.push(objid);
        this.setState({ deletedRole });  
      }

      let newRoleList = roleList.filter(newArray => newArray.id !== objid )
      let newAddedRoleList = addedRole.filter(newArray => newArray.id !== objid )
      
      this.setState({ roleList: newRoleList });
      this.setState({ addedRole: newAddedRoleList });

      this.enableSaveButton();
    }
  }

  addRoleRequest = () => {
    const { addedRole } = this.state;
    
    let newRoleName = []
    addedRole.map(role => newRoleName.push(Object ({rolename: role.rolename}) ))

    fetch(process.env.BACKEND_URL + 'addnewrole', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        newroles: newRoleName
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
    .catch(err => console.log("Fail to call add API: " + err))
  }

  deleteRoleRequest = () => {

    fetch(process.env.BACKEND_URL + 'deleterole', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        deletedroles: this.state.deletedRole
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
    .catch(err => console.log("Fail to call delete API: " + err))
  }

  saveRole = () => {

    if (this.state.addedRole.length > 0){
      this.addRoleRequest();
      this.setState({ addedRole: [] })
    }

    if (this.state.deletedRole.length > 0){
      this.deleteRoleRequest();
      this.setState({ deletedRole: [] })
    }
    
    this.setState({ btnSaveDisabled: true })
  }

  componentDidMount(){

    fetch(`$(process.env.BACKEND_URL)/getchurchrole`, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ roleList: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getrole API: ' + err))
  }

  render() {   
    return (
      <Container className="pa2">
          
        <h1>Setup Role List</h1>

        <Row>
          <Col className="tr">
            <Button className="ma1" 
                    onClick={ this.saveRole }
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
          this.state.roleList.length > 0 &&
          this.state.roleList.map((role, i) => {
            return (
              <div 
                key={ i }
                className="tc v-top dib br3 pa3 ma2 bw2 shadow-2"
              >
              { role.rolename }
                <MdClose 
                  className="ml2 pointer dim"
                  onClick={ ()=>this.removeRole(role.id) }
                />
              </div>
            )
          })
        }

        <div className="tc v-top dib br3 pa3 ma2 bw2 shadow-2">
          <MdAddCircleOutline 
            size={20} 
            className="pointer dim" 
            onClick={ ()=>this.setState({ roleModalShow: true }) }
          />
        </div>

        <Modal show={this.state.roleModalShow} onHide={this.roleModalClose} size="lg">
          <Modal.Header closeButton><h4>Input New Role</h4></Modal.Header>
          <Modal.Body className="tc">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Role Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Enter role name here"
                name="newRoleName"
								onChange={ this.handleChange } 
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.addRole }>OK</Button>
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

export default RoleList;
