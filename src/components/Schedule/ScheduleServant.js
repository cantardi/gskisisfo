import React, { Component } from 'react';
import { Container, Table, Col } from 'react-bootstrap';
import { DateConvert } from '../../helpers/function';

class ScheduleServant extends Component {
  
  returnServantName = (dateid, roleid) => {
    const servant = this.props.servantSchedule
                    .filter(schedule => Number(schedule.dateid) === dateid)
                    .filter(schedule => Number(schedule.roleid) === roleid)
                  
    if (servant.length > 0) return servant[0].servantname
    else return '-'

  }

	render(){
    
		return (
			<Container>
        {
          this.props.periodDates.map(date => {
            return(
              <Col 
                key={ "date-"+date.id }
                md={5}
                className='t v-top dib br3 ma2 shadow-2'
              > 
                <h4 className="pa2 tc">
                  { DateConvert(new Date(date.predefineddate)) }
                </h4>

                <Table size="sm" responsive className="f6">
                  <tbody>
                  {
                    this.props.churchRoles.length > 0 &&
                    this.props.churchRoles.map(role => {
                      return(
                        <tr key={ "role-"+role.id }>
                          <th className="w-50">
                            {role.rolename}
                          </th>
                          
                          <td className="w-50">
                          {
                            this.returnServantName(date.id, role.id)
                          }
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
			</Container>					
		);
	}
	
}

export default ScheduleServant;