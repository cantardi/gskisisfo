import React, { Component } from "react";
import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { callSearchServantAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function'
import ServantSearch from './ServantSearch';
import ServantResult from './ServantResult';
import MessageModal from '../MessageModal';

class ServantLP extends Component {
  
  constructor(props){
    super(props);

    this.PAGE_CHILD = 'ServantDtl';
    this.PAGE_PARENT = 'Administration';

    this.state = {
      servantList: [],
      searchServantName: '',
      searchServantEmail: '',
      searchServantMobile: '',
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
    }
  }
  
  handleServantSearchChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  searchServant = () => {

    const { searchServantName, searchServantEmail, searchServantMobile } = this.state;

    callSearchServantAPI(searchServantName, searchServantEmail, searchServantMobile)
    .then(
      data => this.setState({ servantList: data }),
      error => this.setState({ servantList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  clearSearch = () => {
    this.setState({ searchServantName: '', searchServantEmail: '', searchServantMobile: '', servantList: [] });
  }

  addServant = () => {
    history.push(this.PAGE_CHILD);
  }

  updateServant = (servant) => {
    history.push(this.PAGE_CHILD, servant);
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
          <Dropdown.Item onClick={ this.addServant }>Add New Servant</Dropdown.Item>
          <Dropdown.Item onClick={ ()=> history.push('ServantSchedulerMstr') }>Schedule Servant</Dropdown.Item>
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
              updateServant={ this.updateServant }
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