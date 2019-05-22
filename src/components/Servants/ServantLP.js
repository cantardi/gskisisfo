import React, { Component } from "react";
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import ServantSearch from "./ServantSearch";
import ServantResult from "./ServantResult";
import MessageModal from "../MessageModal";

class ServantLP extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      servantList: [],
      searchServantName: '',
      searchServantEmail: '',
      searchServantMobile: '',
      modalShow: false, 
      modalMsg: '',
      modalHdr: '',
    }
  }
  
  nameChange = (e) => {
    this.setState({ searchServantName: e.target.value });
  }

  emailChange = (e) => {
    this.setState({ searchServantEmail: e.target.value });
  }

  mobileChange = (e) => {
    this.setState({ searchServantMobile: e.target.value });
  }

  searchServant = () => {
    this.setState({ servantList: [] });
    
    fetch('http://localhost:3001/searchservant', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.state.searchServantName,
        email: this.state.searchServantEmail,
        mobile: this.state.searchServantMobile
      })
    })
      .then (response => {
        if (response.status === 200){
          return response.json()
          .then(data => this.setState(Object.assign(this.state.servantList, data)))
        }
        else { 
          return response.json()
          .then(data => this.setState({ modalShow: true , modalHdr: 'Error', modalMsg: data }))
        }
      }) 
      .catch(err => console.log)
  }

  clearSearch = () => {
    this.setState({
      searchServantName: '',
      searchServantEmail: '',
      searchServantMobile: ''
    })
  }

  openEditMode = (servant) => {
    this.props.history.push('/ServantDtl', servant);
  }

  modalClose = () => this.setState({ modalShow: false })

  routeToPage = (pagename) => {
    this.props.history.push(pagename);
  }

  render() {
    return(
      <Container className="pa2">
        <DropdownButton 
          className="ma2"
          title="Action"
          id="dropdown-secondary-button"
          key="servantAction"
          align="right">               
          <Dropdown.Item onClick={ ()=> this.routeToPage('/ServantDtl') }>
            Add New Servant
          </Dropdown.Item>
          <Dropdown.Item onClick={ ()=> this.routeToPage('/ServantSchedulerMstr') }>
            Schedule Servant
          </Dropdown.Item>
        </DropdownButton>

        <ServantSearch 
          servantName={ this.state.searchServantName }
          servantEmail={ this.state.searchServantEmail }
          servantMobile={ this.state.searchServantMobile }
          searchServant={ this.searchServant }
          clearSearch={ this.clearSearch } 
          onNameChange={ this.nameChange }
          onEmailChange={ this.emailChange }
          onMobileChange={ this.mobileChange }
        />

        {
          this.state.servantList !== null &&
          <ServantResult 
            servantList={ this.state.servantList } 
            openEditMode={ this.openEditMode }
          />
        }

        <MessageModal
          show={ this.state.modalShow }
          onHide={ this.modalClose }
          header={ this.state.modalHdr }
          errmsg={ this.state.modalMsg }
        />

      </Container>
    )
  }
}
 
export default ServantLP;