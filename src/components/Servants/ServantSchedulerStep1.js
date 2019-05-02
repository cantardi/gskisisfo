import React, { Component } from "react";

class ServantSchedulerStep1 extends Component {
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
                    <tr key={ i }>
                      <th scope="row">{ dateList.id }</th>
                      <td>{ dateList.date }</td>
                      <td>
                        <button className="btn btn-primary ml2 tc2">Add</button>
                        <button className="btn btn-primary ml2 tc2">Remove</button>
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
 
export default ServantSchedulerStep1;

