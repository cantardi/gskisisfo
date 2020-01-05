import React, { Component } from "react";
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import {history} from '../../helpers/function'
import ServantSearch from './ServantSearch';
import ServantResult from './ServantResult';
import MessageModal from '../MessageModal';

class ServantLP extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      servantList: [],
      searchServantName: '',
      searchServantEmail: '',
      searchServantMobile: '',
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
    }
    window.scrollTo(0, 0);
  }
  
  handleServantSearchChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  callSearchServantAPI = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/searchservant', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.state.searchServantName,
        email: this.state.searchServantEmail,
        mobile: this.state.searchServantMobile,
        limit: 20
      })
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ servantList: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log("Fail to call searchservant API: " + err)) 
  }

  searchServant = () => {
    this.setState({ servantList: [] });
    this.callSearchServantAPI();
  }

  clearSearch = () => {
    this.setState({
      searchServantName: '',
      searchServantEmail: '',
      searchServantMobile: '',
      servantList: []
    })
  }

  routeToPage = (pagename) => {
    history.push(pagename);
  }

  openEditMode = (servant) => {
    history.push('/ServantDtl', servant);
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false }) 
  }

  render() {

    return(
      <Container className="pa2">
        <DropdownButton 
          className="ma2"
          title="Action"
          id="dropdown-secondary-button"
          key="servantAction"
          align="right"
        >          
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
          handleChange={ this.handleServantSearchChange }
        />

        {
          this.state.servantList.length > 0 &&
          <div>
            <div className="alert alert-info" role="alert">
              Search feature will display only the first 20 rows.
              Please filter your search for optimum result.
            </div>
            <ServantResult 
              servantList={ this.state.servantList } 
              openEditMode={ this.openEditMode }
            />
          </div>
        }

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
 
export default ServantLP;