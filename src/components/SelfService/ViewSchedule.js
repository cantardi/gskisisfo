import React, { Component } from 'react';
import { Form, Container, Col } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';
import { callGetPeriodAPI, callGetPeriodDateAPI } from '../../helpers/apicall';
import { history } from '../../helpers/function';
import MessageModal from '../MessageModal';

class ViewSchedule extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      periodList: [],
      selectedPeriod: 0,
      displayedDates: [],
      selectedDate: '',
      displayedSongs: [],
      selectedSongs: [],
      msgModalShow: false, 
      msgModalHeader: '',
      msgModalContent: '',
      viewType: '0'
    }
    
  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false })
  }

  handlePeriodChange = (e) => {
    this.setState({ selectedPeriod: Number(e.target.value) });
    this.setState({ viewType: '0' })
    this.setState({ displayedDates: [] });
    this.setState({ selectedSongs: [] });
    this.setState({ displayedSongs: [] });
    
    callGetPeriodDateAPI(Number(e.target.value))
    .then(
      data => this.setState({ displayedDates: data }),
      error => this.setState({ selectedPeriod: '', displayedDates: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
  }

  handleViewTypeChange = (e) => {
    this.setState({ viewType: e.target.value })

    if (e.target.value === '1'){
      let sentPeriod = this.state.periodList.filter(period => period.id === this.state.selectedPeriod)
      history.push('MaintainSchedule', { period: sentPeriod[0], PAGE_PARENT: 'ViewSchedule', editFlag: false, notifyFlag: false })
    }
  }

  openServiceDate = (id, predefineddate) => {
    let dates = {id, predefineddate}
    let sentPeriod = this.state.periodList.filter(period => period.id === this.state.selectedPeriod)
    history.push('MaintainSchedule', { selectedDate: dates, PAGE_PARENT: 'ViewSchedule', period: sentPeriod[0], editFlag: false, notifyFlag: false })
  }
  
  componentDidMount(){
    window.scrollTo(0, 0);
        
    callGetPeriodAPI()
    .then(
      data => this.setState({ periodList: data }),
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))
  }

  render() {
    
    return ( 
      <Container className="pa2">   
        
        <h1>View Schedule</h1>
        
        <br/>

        <Form.Group>
          <Form.Label>Service Period</Form.Label>
          <Form.Control 
            as="select" 
            name="status"
              value={ this.state.selectedPeriod }
              onChange={ this.handlePeriodChange }
            >
              <option key="0" value="0">--Select Period--</option>
              {
                this.state.periodList.length > 0 &&
                this.state.periodList.map((period) => 
                  <option key={ period.id } value={ period.id }>
                    { period.description }
                  </option>
                )
              }
          </Form.Control>
        </Form.Group>
        {
          this.state.selectedPeriod === 0? 
          (
            null
          )
          :
          (
            <Form.Group>
              <Form.Label>View Type</Form.Label>
              <Form.Control 
                as="select" 
                name="status"
                  value={ this.state.viewType }
                  onChange={ this.handleViewTypeChange }
                >
                  <option key="no" value="0">--Select Type--</option>
                  <option key="alldate" value="1">All Dates</option>
                  <option key="bydate" value="2">Selected Dates</option>
              </Form.Control>
            </Form.Group>
          )
        }
        
        {
          this.state.viewType === "2"?
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

                      <p className="tc">Click to view the details</p>
                    </Col>
                  )
                })
              }
              </Form.Row>
            </Form.Group>
          )
          :
          (
            null  
          )
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
 
export default ViewSchedule;