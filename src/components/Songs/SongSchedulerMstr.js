import React, { Component } from "react";
import SongSchedulerStep1 from './SongSchedulerStep1';
import SongSchedulerStep2 from './SongSchedulerStep2';
import SongSchedulerStep3 from './SongSchedulerStep3';

class SongSchedulerMstr extends Component {

  constructor() {
    super()
    // Set the initial input values
    this.state = {
      currentStep: 1, // Default is Step 1
      allperiod: [{
            id: 1,
            name: "JANUARI-2019-8AM"
        }, {
            id: 2,
            name: "FEBRUARI-2019-8AM"
        }, {
            id: 3,
            name: "MARET-2019-8AM"
        }, {
            id: 4,
            name: "APRIL-2019-8AM"
        }, {
            id: 5,
            name: "MEI-2019-8AM"
        
      }],
      selectedPeriod: 'Choose...',
      selectedSong: [],
      alldate: [{
            id: 1,
            predefinedDate: [{
              id: 1,
              date: "01-JAN-2019",
            }, {
              id: 2,
              date: "04-JAN-2019",
            }, {
              id: 3,
              date: "11-JAN-2019",
            }]
          }, {
            id: 2,
            predefinedDate: [{
              id: 1,
              date: "05-FEB-2019",
            }, {
              id: 2,
              date: "12-FEB-2019",
            }, {
              id: 3,
              date: "19-FEB-2019",
            }]
      }],
      displayedDate: [],
    }
    // Bind the submission to handleChange() 
    this.handlePeriodChange = this.handlePeriodChange.bind(this)
    this.handleSongChange = this.handleSongChange.bind(this)
    this._next = this._next.bind(this)
    this._prev = this._prev.bind(this)
  }

   // Test current step with ternary
  // _next and _previous functions will be called on button click
  _next() {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }
    
  _prev() {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  // The "next" and "previous" button functions
  get previousButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 1, then render the "previous" button
    if(currentStep !==1){
      return (
        <button 
          className="btn btn-secondary" 
          type="button" onClick={this._prev}>
        Previous
        </button>
      )
    }
    // ...else return nothing
    return null;
  }

  get nextButton(){
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if(currentStep <3){
      return (
        <button 
          className="btn btn-primary float-right" 
          type="button" onClick={this._next}>
        Next
        </button>        
      )
    }
    // ...else render nothing
    return null;
  }

  // Use the submitted data to set the state
  handlePeriodChange(event) {
    this.setState({ selectedPeriod: event.target.value });

    const selectedDate = this.state.alldate.filter(onedate => {
      return onedate.id===parseInt(event.target.value);
    });
    this.setState({ displayedDate: selectedDate[0].predefinedDate })
    //this.setState({ selectedSong: [] })
  }
  
  // Use the submitted data to set the state
  handleSongChange(dateList, event) {
    
    let songObj = {serviceDateId: dateList.id, songName: event.target.value};
    //newStateArray.push(PersonObj);
    //this.setState({ selectedSong: newStateArray });
    console.log(songObj);
 
    this.setState({ selectedSong: this.state.selectedSong.concat(songObj) });
    
  }

  // Trigger an alert on form submission
  handleSubmit = (event) => {
    event.preventDefault()
    const { email, username, password } = this.state
    alert(`Your registration detail: \n 
      Email: ${email} \n 
      Username: ${username} \n
      Password: ${password}`)
  }
    

  // Render UI will go here...
  render() {    
    return (
      <div className="container">
        <React.Fragment>
          <h1>Schedule Song Wizard</h1>
          <p>Step {this.state.currentStep} </p> 
            
          <form onSubmit={this.handleSubmit}>

            <SongSchedulerStep1
              currentStep={this.state.currentStep} 
              handlePeriodChange={this.handlePeriodChange}
              selectedPeriod={this.state.selectedPeriod}
              allperiod={this.state.allperiod}
              displayedDates={this.state.displayedDate}
            />
            <SongSchedulerStep2
              currentStep={this.state.currentStep} 
              displayedDates={this.state.displayedDate}
              handleSongChange={this.handleSongChange}
              selectedSong={this.state.selectedSong}
            />
            <SongSchedulerStep3
              currentStep={this.state.currentStep} 
              displayedDates={this.state.displayedDate}
              selectedSong={this.state.selectedSong}
            />       

            {this.previousButton}
            {this.nextButton}

          </form>
        </React.Fragment>
      </div>
    )
  }
}
 
export default SongSchedulerMstr;