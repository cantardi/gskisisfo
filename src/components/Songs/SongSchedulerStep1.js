import React, { Component } from 'react';
import { Form, Table } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';

class SongSchedulerStep1 extends Component {

  render() {
    
    if (this.props.currentStep !== 1) { // Prop: The current step
      return null
    }
    
    return ( 
      <div>
        <Form.Group>
          <Form.Label>Service Period</Form.Label>
          <Form.Control 
            as="select" 
            name="status"
            value={ this.props.selectedPeriod }
            onChange={ this.props.handlePeriodChange }
          >
            <option key="0" value="">Select Period</option>
            {
              this.props.allperiod.map((period) => 
                <option key={ period.id } value={ period.id }>
                  { period.periodname }
                </option>
              )
            }
          </Form.Control>
        </Form.Group>
        
        {
          (this.props.selectedPeriod !== '' && this.props.displayedDates.length === 0) ? 
          (
            <div className="alert alert-info" role="alert">
              Predefined dates do not exist in this period. Please add predefined dates for this period in Period Management page.
            </div>
          ):  
          (
            <Form.Group>
              <Form.Label>Predefined Dates</Form.Label>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="w-20">#</th>
                    <th className="w-80">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.displayedDates.map((date, i) => {
                      return(
                        <tr key={ i }>
                          <td className="w-20">{ i+1 }</td>
                          <td className="w-80">{ DateConvert(new Date(date.predefineddate)) }</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </Form.Group>
          )
        }

      </div> 
    )
  }

}
 
export default SongSchedulerStep1;

