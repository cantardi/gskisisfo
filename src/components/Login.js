import React from 'react';
import { Form, Button } from 'react-bootstrap'

class Login extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      signInUsername: '',
      signInPassword: '',
      errMsg: '',
    }
  }

  handleLoginDetailChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = () => {
    
    fetch('http://localhost:3001/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: this.state.signInUsername,
        password: this.state.signInPassword
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.props.signInToSystem(data))
      }
      else {
        this.setState({ errMsg: 'Username or password is incorrect'})
      }
    }) 
    .catch(err => console.log("Fail to call signin api: " + err))
      
  }

  render(){
    return (
      <div className="vh-100 dt w-100">
        <div className="dtc v-mid">
          
          <Form className="br2 pa4 bw2 center mw6-ns shadow-2">
            <h3 className="tc pa3">Account Login</h3>

            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" name="signInUsername" placeholder="Enter username" onChange={this.handleLoginDetailChange} required />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="signInPassword" placeholder="Enter password" onChange={this.handleLoginDetailChange}  required/>
            </Form.Group>

            <Form.Row>
              <Button className="w-100" variant="primary" onClick={this.handleSubmit}>
                Login
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