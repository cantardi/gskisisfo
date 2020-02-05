import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class PeriodResult extends Component {

  render(){
    
    return (
      <Container className="ma2">      
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          
          <tbody>
          {
            this.props.periodList.map((period, i) => {
              return(
                <tr key= {i}>
                  <td className="w-5">{ i+1 }</td>
                  <td 
                    className="fw6 blue no-underline underline-hover pointer w-30"
                    onClick={ ()=>this.props.updatePeriod(period) }
                  >
                    { period.periodname }
                  </td>
                  <td className="w-10">{ (period.status==='A')? 'Active': 'Inactive' }</td>
                  <td className="w-55">{ period.description }</td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
        
      </Container>
    )
    
  }

}

export default PeriodResult;