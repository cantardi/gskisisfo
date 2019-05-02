import React, { Component } from "react";
import { Button } from 'react-bootstrap';

class SongSchedulerStep1 extends Component {
  render() {

    if (this.props.currentStep !== 1) { // Prop: The current step
      return null
    }
    return (  
      <div className="form-group">
        <label>Service Period</label>
        <select value={this.props.selectedPeriod} onChange={this.props.handlePeriodChange} className="form-control">
          {this.props.allperiod.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}
        </select>
        <div>&nbsp;</div>
        <label>Pre-defined Date</label>
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {this.props.displayedDates.map((dateList, i) => {
                  return(
                    <tr>
                      <th scope="row">{ dateList.id }</th>
                      <td key={ i }>{ dateList.date }</td>
                      <td>
                        <Button className='ma1'>Add</Button>
                        <Button className='ma1'>Remove</Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
      </div>
    );
  }
}
 
export default SongSchedulerStep1;

