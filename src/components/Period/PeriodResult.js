import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class PeriodResult extends Component {

  render(){
    return (
      <Container className="ma2">      
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Period Name</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.periodList.map((period, i) => {
              return(
                <tr key= {i}>
                  <td>{ i+1 }</td>
                  <td 
                    className="fw6 blue no-underline underline-hover pointer"
                    onClick={ ()=>this.props.openEditMode(period) }>
                    { period.periodname }
                  </td>
                  <td>{ (period.status==='A')? 'Active': 'Inactive' }</td>
                  <td>{ period.description }</td>
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