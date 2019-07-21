import React, { Component } from 'react';
import { Table, FormControl } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';

class ServantSchedulerStep2 extends Component {

  render() {
    
    if (this.props.currentStep !== 2) { // Prop: The current step
      return null
    }

    return (
      
      <div>
        {
          this.props.displayedDates.map(date => {
          return (
            <Table key={ 'tbl'+date.id } responsive>            
              <thead>
                <tr>
                  <th key={ 'th'+date.id }>
                    { DateConvert(new Date(date.predefineddate)) } 
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr> 
                  <td>
                    {
                      this.props.selectedServants.length > 0 &&
                      this.props.selectedServants
                      .filter(selectedServant => Number(selectedServant.dateid) === Number(date.id))
                      .map(selectedServant => {
                        return(
                          <div 
                            key={ selectedServant.roleid }
                            className="tc v-top dib br3 pa2 ma1 bw2 shadow-1"
                          >
                            { selectedServant.rolename }
                            <FormControl
                              as="select"
                              size="sm"                  
                              value={ selectedServant.servantid }
                              onChange={ (e)=>this.props.selectServant(e, selectedServant.dateid, selectedServant.roleid, selectedServant.rolename) }
                            >
                              <option key="0" value="">Choose...</option>
                              {
                                this.props.servantList.map(servant => 
                                  <option key={ servant.id } value={ servant.id }>
                                    { servant.servantname }
                                  </option>
                                )
                              }
                            </FormControl>
                          </div>
                        )
                      })
                    }

                  </td>
                </tr>
              </tbody>
            </Table>
            )
          })
        }
      </div>
    )
  }
  
}
 
export default ServantSchedulerStep2;

