import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class PeriodResult extends Component {

  render(){
    return (
      <Container className="ma2">
        <Table responsive="md">
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
            this.props.periodList !== null &&
              this.props.periodList.map((period, i) => {
                return(
                  <tr key= {i}>
                    <td>{ i+1 }</td>
                    <td style={{cursor: 'pointer'}} className="fw6 db blue no-underline underline-hover" onClick={this.props.openEditMode}>{ period.name }</td>
                    <td>{ period.status }</td>
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