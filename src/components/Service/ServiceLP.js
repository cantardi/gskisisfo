import React, { Component } from "react";
import { Form, Container, Col } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import MessageModal from '../MessageModal';

class ServiceLP extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      allperiod: [],
      selectedPeriod: '',
      displayedDates: [],
      selectedDate: '',
      displayedSongs: [],
      selectedSongs: [],
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
    }
    
  }

  messageModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  handlePeriodChange = (e) => {

    this.setState({ selectedPeriod: e.target.value });
    this.setState({ displayedDates: [] });
    this.setState({ selectedSongs: [] });
    this.setState({ displayedSongs: [] });
    
    fetch(process.env.REACT_APP_BACKEND_URL + '/getperioddate/'+e.target.value, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ displayedDates: data }))
      }
    }) 
    .catch(err => console.log (err))
  }

  componentDidMount(){
    fetch(process.env.REACT_APP_BACKEND_URL + '/getperiod', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => this.setState({ allperiod: data }))
      }
      else { 
        return response.json()
        .then(data => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: data }))
      }
    }) 
    .catch(err => console.log('Fail to call getperiod API: ' + err))
  }

  openServiceDate = (dateid, datevalue) => {
    const date = {dateid, datevalue}
    this.props.history.push('/ServiceMstr', date);
  }

  render() {
    
    return ( 
      <Container className="ma2">   
        
        <h1>Service Management</h1>
        
        <br/>

        <Form.Group>
          <Form.Label>Service Period</Form.Label>
          <Form.Control 
            as="select" 
            name="status"
              value={ this.state.selectedPeriod }
              onChange={ this.handlePeriodChange }
            >
              <option key="0" value="">Select Period</option>
              {
                this.state.allperiod.length > 0 &&
                this.state.allperiod.map((period) => 
                  <option key={ period.id } value={ period.id }>
                    { period.periodname }
                  </option>
                )
              }
            </Form.Control>
          </Form.Group>
          
          {
            (this.state.selectedPeriod !== '' && this.state.displayedDates.length === 0) ? 
            (
              <div className="alert alert-info" role="alert">
                Predefined dates do not exist in this period. Please add predefined dates for this period in Period Management page.
              </div>
            ):
            (
              <Form.Group>
                <Form.Row>Service Dates</Form.Row>
                <Form.Row>
                {
                  this.state.displayedDates.length > 0 &&
                  this.state.displayedDates.map(date => {
                    return (
                      <Col 
                        key={ "date-"+date.id }
                        md={2}
                        className='t v-top dib br3 ma2 shadow-2 pointer grow'
                        onClick={ ()=>this.openServiceDate(date.id, date.predefineddate) } 
                      > 
                        <h6 className="pa2 tc">
                          { DateConvert(new Date(date.predefineddate)) }
                        </h6>

                        <p className="tc">Song is not selected</p>
                      </Col>
                    )
                  })
                }
                </Form.Row>
              </Form.Group>
            )  
          }
          
          <MessageModal
            show={ this.state.msgModalShow }
            onHide={ this.modalClose }
            header={ this.state.msgModalHeader }
            content1={ this.state.msgModalContent }
          />
          
        </Container> 
      )
  }

}
 
export default ServiceLP;