import React, { Component } from 'react';
import { Form, Container, Button } from 'react-bootstrap';
import { history } from '../../helpers/function'
import { callGetSchedulingPeriodAPI, callAddSongSchedAPI, callGetPeriodDateAPI } from '../../helpers/apicall';
import MessageModal from '../MessageModal';
import SongSchedulerStep1 from './SongSchedulerStep1';
import SongSchedulerStep2 from './SongSchedulerStep2';
import SongSchedulerStep3 from './SongSchedulerStep3';

class SongSchedulerMstr extends Component {

  constructor() {
    super()
    
    this.state = {
      currentStep: 1,
      periodList: [],
      selectedPeriod: '',
      displayedDates: [],
      selectedSongs: [],
      msgModalShow: false, 
      msgModalContent: '',
      msgModalHeader: '',
      isValidated: false,
    }

  }

  msgModalClose = () => {
    this.setState({ msgModalShow: false });
    if (this.state.currentStep === 3) history.push('SongLP');
  }

  _next = () => {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({ currentStep })
    this.validateSongCompletion();
  }
    
  _prev = () => {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({ currentStep })
  }

  _submit = () => {

    if (window.confirm('Are you sure to submit this schedule?')) {
      const songSchedule = this.state.selectedSongs.map(song =>
        ({
          periodid: this.state.selectedPeriod,
          dateid: song.dateid,
          songid: song.song.id
        })
      )
  
      
      callAddSongSchedAPI(songSchedule)
      .then(
        data => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: data }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Error', msgModalContent: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
    }

  }

  get previousButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 1, then render the "previous" button
    if(currentStep !==1){
      return (
        <Button 
          className="btn btn-secondary" 
          onClick={this._prev}>
        Previous
        </Button>
      )
    }
    // ...else return nothing
    return null;
  }

  get nextButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if(currentStep < 3 && this.state.displayedDates.length > 0){
      return (
        <Button 
          className="btn btn-primary float-right" 
          onClick={this._next}>
        Next
        </Button>        
      )
    }
    // ...else render nothing
    return null;
  }

  get submitButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if(currentStep === 3 && this.state.isValidated){
      return (
        <Button 
          className="btn btn-primary float-right" 
          onClick={this._submit}>
        Submit
        </Button>        
      )
    }
    // ...else render nothing
    return null;
  }

  handlePeriodChange = (e) => {
    
    this.setState({ selectedPeriod: Number(e.target.value), displayedDates: [], selectedSongs: [] });
    
    if (e.target.value !== '') {
      callGetPeriodDateAPI(Number(e.target.value))
      .then(
        data => this.setState({ displayedDates: data }),
        error => this.setState({ msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
      )
      .catch(err => console.log("Fail to call API due to: " + err))
    }

  }

  validateSong(song) {
    return this.state.selectedSongs
      .filter(selectedSong => selectedSong.reactobjid===song.reactobjid)
  }
  
  validateSongCompletion = () => {
    let dateIdList = this.state.displayedDates.map(date => date.id)
    let selectedIdList = this.state.selectedSongs.map(date => Number(date.dateid))
    let isValidated = dateIdList.every(val => selectedIdList.includes(val))
    this.setState({ isValidated })
  }

  addSong = (dateid, song) => {
    const { selectedSongs } = this.state;
    const reactobjid = 'div_' + dateid + '_' + song.id;

    let addedSong = {dateid, song, reactobjid}
    
    if (this.validateSong(addedSong).length > 0){
      alert('Song already exists')
    }
    else{
      selectedSongs.push(addedSong);
      this.setState({ selectedSongs }); 
    }
  }

  removeSong = (reactobjid) => {
    const { selectedSongs } = this.state;
    
    let newSelectedSongs = selectedSongs.filter(newArray => newArray.reactobjid !== reactobjid )
    this.setState({ selectedSongs: newSelectedSongs });
  }

  componentDidMount(){

    callGetSchedulingPeriodAPI()
    .then(
      data => this.setState({ periodList: data }),
      error => this.setState({ periodList: [], msgModalShow: true , msgModalHeader: 'Information', msgModalContent: error.message })
    )
    .catch(err => console.log("Fail to call API due to: " + err))

  }

  render() {
    
    return (
      <Container className="pa2">
        
        <h1>Schedule Song Wizard</h1>
        
        <React.Fragment>
          <h4 className="mt4 mb4">Step {this.state.currentStep} > </h4> 
            
          <Form>
            <SongSchedulerStep1
              currentStep={ this.state.currentStep } 
              selectedPeriod={ this.state.selectedPeriod }
              handlePeriodChange={ this.handlePeriodChange }
              periodList={ this.state.periodList }
              displayedDates={ this.state.displayedDates }
            />

            <SongSchedulerStep2
              currentStep={ this.state.currentStep } 
              displayedDates={ this.state.displayedDates }
              selectedSongs={ this.state.selectedSongs }
              addSong={ this.addSong }
              removeSong={ this.removeSong }
            />

            <SongSchedulerStep3
              currentStep={ this.state.currentStep } 
              displayedDates={ this.state.displayedDates }
              selectedSongs={ this.state.selectedSongs }
              isValidated={ this.state.isValidated }
            />      

            <div>&nbsp;</div>

            {this.previousButton}
            {this.nextButton}
            {this.submitButton}

          </Form>
        </React.Fragment>

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
 
export default SongSchedulerMstr;