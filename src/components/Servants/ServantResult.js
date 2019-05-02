import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class ServantResult extends Component {

  render(){
    return (
      <Container className="ma2">
        <Table responsive="md">
          <thead>
            <tr>
              <th>#</th>
              <th>Servant Name</th>
              <th>Servant Email</th>
              <th>Servant Mobile</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.servantList !== null &&
              this.props.servantList.map((servant, i) => {
                return(
                  <tr key={i}>
                    <td>{ i+1 }</td>
                    <td style={{cursor: 'pointer'}} className="fw6 db blue no-underline underline-hover" onClick={this.props.openEditMode} >{ servant.name }</td>
                    <td>{ servant.email }</td>
                    <td>{ servant.mobile }</td>
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

export default ServantResult;