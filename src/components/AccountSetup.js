import React, { Component } from "react";
import { Form, Col, Button } from 'react-bootstrap';
import { callGetServantByIdAPI } from '../helpers/apicall';
import { authenticationService } from '../services/authenticationService';

class AccountSetup extends Component {
  
  state = {
    servantname: '',
    username: '',
    gender: '',
    email: '',
    mobile: ''
  }


  changePassword = () => {
    alert("Show change password modal")
  }

  componentDidMount() {
    let user = authenticationService.currentUser;
    let servantid = user.source._value.servantid;

    this.setState({ username: user.source._value.username });

    callGetServantByIdAPI(servantid)
    .then(
      data => this.setState({ servantname: data[0].servantname, gender: data[0].genderdesc, email: data[0].email, mobile: data[0].mobile1 }),
      error => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
  }

  render() {
    
    return (

      <div className="dt w-100 ma2">
        <div className="dtc v-mid">
          
          <Form className="br2 pa4 bw2 center mw6-ns shadow-2">
            <h3 className="tc pa2">Hello, {this.state.servantname}</h3>

            <Form.Group as={Col} controlId="formServantName">
              <Form.Label>Username</Form.Label>
              <Form.Control readOnly
                name="servantname"
                value={ this.state.username }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control readOnly
                name="gender"
                value={ this.state.gender }
              />
            </Form.Group>
            
            <Form.Group as={Col} controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control readOnly
                name="email"
                value={ this.state.email }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formMobile">
              <Form.Label>Mobile</Form.Label>
              <Form.Control readOnly
                name="mobile1"
                value={ this.state.mobile }
              />
            </Form.Group>

            <Form.Row>
              <Button className="w-100" variant="primary" onClick={this.changePassword}>
                Change Password
              </Button>
            </Form.Row>

          </Form>
        </div>
      </div>

    );
  }
}
 
export default AccountSetup;