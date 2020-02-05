import React, { Component } from 'react';
import { Table, Col } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';

class ServantSchedulerStep3 extends Component {
  
  render() {
    
    if (this.props.currentStep !== 3) { // Prop: The current step
      return null
    }

    if (this.props.isValidated === true) {
      return (
        <div className="tc">
        {
          this.props.displayedDates.map(date => {
            return(
              <Col 
                key={ "date-"+date.id }
                md={5}
                className='t v-top dib br3 ma2 shadow-2'
              > 

                <h4 className="pa2 tc">
                  { DateConvert(new Date(date.predefineddate)) }
                </h4>

                <Table size="sm" responsive className="f6 tl">
                  <tbody>
                  {
                    this.props.selectedServants.length > 0 &&
                    this.props.selectedServants
                    .filter(servant => Number(servant.dateid) === date.id)
                    .map(servant => {
                      return (
                        <tr key={`tr-${servant.dateid}-${servant.servantid}`}>
                          <th className="w-50">
                            {servant.rolename}
                          </th>
                          
                          <td className="w-50">
                            {servant.servantname}
                          </td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </Table>
              </Col>
            )
          })
        }
        </div>
      )
    }
    else {
      return (
        <div className="alert alert-info" role="alert">
          Servant has not been selected for some pre-defined dates. Click on Previous button to complete the selection in order to submit.
        </div>
      )
    }
    
  }

}
 
export default ServantSchedulerStep3;

