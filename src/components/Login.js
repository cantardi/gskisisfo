import React from 'react';
import { Form, Button, Spinner } from 'react-bootstrap'
import { authenticationService } from '../services/authenticationService';
import {history} from '../helpers/function'

class Login extends React.Component {
  
  constructor(props){
    
    super(props);
    this.state = {
      signInUsername: '',
      signInPassword: '',
      errMsg: '',
      spinnerShow: false
    }

    if (authenticationService.currentUserValue) { 
      history.push('/');
    }
  }

  handleUsernameChange = (e) => {
    this.setState({ signInUsername: e.target.value.toLowerCase() });
  }

  handlePasswordChange = (e) => {
    this.setState({ signInPassword: e.target.value });
  }

  handleLogin = () => {
    
    const { signInUsername, signInPassword } = this.state;

    if (signInUsername === '' || signInPassword === '') {
      this.setState({ errMsg: "Username or password cannot be blank" })
    }
    else {
      this.setState({ errMsg: '', spinnerShow: true }, this.callSignInAPI())
    }
    
  }

  callSignInAPI = () => { 
    
    const { signInUsername, signInPassword } = this.state
     
    authenticationService.login(signInUsername, signInPassword)
      .then(
        user => {
          const { from } = this.props.location.state || { from: { pathname: "/" } };
          history.push(from);
        },
        error => {
          this.setState({ errMsg: error, spinnerShow: false})
        }
    );
    
  }

  render(){
    
    return (

      <div className="vh-100 dt w-100 ma2">
        <div className="dtc v-mid">
          
          <Form className="br2 pa4 bw2 center mw6-ns shadow-2">
            <h3 className="tc pa3">Account Login</h3>

            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" name="signInUsername" placeholder="Enter username" onChange={this.handleUsernameChange} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="signInPassword" placeholder="Enter password" onChange={this.handlePasswordChange} />
            </Form.Group>

            <Form.Row>
              <Button className="w-100" disabled={this.state.spinnerShow} variant="primary" onClick={this.handleLogin}>
              {
                this.state.spinnerShow === false? (
                  <div>Login</div>
                ): (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Signing in...</span>
                  </Spinner>
                )
              }
              </Button>
            </Form.Row>
            
            {
              this.state.errMsg !== ''? (
                <div className="alert alert-danger mt3 tc" role="alert">{this.state.errMsg}</div>
              ): (
                null
              )
            }

          </Form>
        </div>
      </div>
    )  
  }
  
}

export default Login;