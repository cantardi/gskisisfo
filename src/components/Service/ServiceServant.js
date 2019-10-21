import React, { Component } from 'react';
import { Container, Table, FormControl } from 'react-bootstrap';

class ServiceServant extends Component {
  
  returnServantName = (roleid) => {
    const servant = this.props.scheduledServants
                    .filter(schedule => Number(schedule.roleid) === roleid)
    
    if (servant.length > 0) return servant[0].servantname
    else return '-'

  }

  returnServantID = (roleid) => {
    const servant = this.props.realizedServants
                    .filter(schedule => Number(schedule.roleid) === roleid)
                  
    if (servant.length > 0) return servant[0].servantid
    else return ''

  }

	render(){
    
		return (
			<Container>
        <Table responsive>
          <thead>
            <tr>
              <th>Role</th>
              <th>Scheduled</th>
              <th>On Stage</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.churchRoles.length > 0 &&
              this.props.churchRoles.map(role => {
                return(
                  <tr key={ "role-"+role.id }>
                    <td className="w-30">
                      {role.rolename}
                    </td>          
                    <td className="w-40">
                    {
                      this.returnServantName(role.id)
                    }
                    </td>
                    <td className="w-40">
                      <FormControl
                        as="select"
                        value={ this.returnServantID(role.id) }
                        onChange={ (e)=>this.props.updateServantList(e, role.id) }
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
                    </td>
                  </tr>
                )   
              })
            }
          </tbody>
        </Table>
			</Container>					
		);
	}
	
}

export default ServiceServant;