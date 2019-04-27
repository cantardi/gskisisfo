import React, { Component } from "react";
import {Table, Form, Col} from "react-bootstrap";

var servantRole = ['Worship Leader', 'Singer 1', 'Singer 2', 'Drummer', 'Bassist', 'Guitarist', 'Keyboardist'];
var personNames = ['Ardiansyah', 'Eveline Natasya', 'Ryan Antonius', 'Monica Christin'];

class ScheduleServantStep2 extends Component {

  render() {

    if (this.props.currentStep !== 2) { // Prop: The current step
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
                  <th key={ i }>{ dateList.date }</th>
                </tr>
              </thead>
              <tbody>
                {servantRole.map((role, j) => {                      
                      let previousSelectedServant= this.props.selectedServant
                                                    .filter(servantList => servantList.serviceDateId===dateList.id)
                                                    .filter(servantList => servantList.role==role)       
                      return(
                        <tr>
                          <th>{ role }</th>
                          <td key={ j }>

                            <Form.Control as="select" defaultValue={(this.props.selectedServant.length!=21)? 'Choose...': previousSelectedServant[0].personName} onChange={(event)=>this.props.handlePersonChange(dateList, role, event)}>
                              <option>Choose...</option>
                              {
                                personNames.map((personName) => (<option>{ personName }</option>))
                              }
                            </Form.Control>
                          </td>
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
 
export default ScheduleServantStep2;

