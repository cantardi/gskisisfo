import React, { Component } from "react";
import { Table } from "react-bootstrap";

class ScheduleServantStep3 extends Component {
  
  render() {

    if (this.props.currentStep !== 3) { // Prop: The current step
      return null
    }

    return (
      <div className='container'>

        {this.props.displayedDates.map((dateList, i) => {
          return(
            <Table responsive>            
              <thead>
                <tr>
                  <th></th>
                  <th key={ dateList.id }>{ dateList.date }</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.selectedServant
                    .filter(servantList => servantList.serviceDateId===dateList.id)
                    .map((servantList, j) => {
                      return(
                        <tr key={ j }>
                          <th>{ servantList.role }</th>
                          <td>{ servantList.personName }</td>
                        </tr>
                      )
                    })
                    
                }
              </tbody>
            </Table>
          )
        })}        

      </div>
    )
  }
}
 
export default ScheduleServantStep3;

