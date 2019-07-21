import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

class ServantResult extends Component {

  render(){
    return (
      <Container className="ma2">
        <Table responsive>
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
            this.props.servantList.map((servant, i) => {
              return(
                <tr key={i}>
                  <td className="w-10">{ i+1 }</td>
                  <td 
                    className="fw6 blue no-underline underline-hover pointer w-30"
                    onClick={ ()=>this.props.openEditMode(servant) }
                  >
                    { servant.servantname }
                  </td>
                  <td className="w-40">{ servant.email }</td>
                  <td className="w-20">{ servant.mobile1 }</td>
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