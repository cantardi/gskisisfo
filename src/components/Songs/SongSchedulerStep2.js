import React, { Component } from "react";
import { Table, Form, Button } from "react-bootstrap";

var songNames = ['Ajarku Setia', 'Tuhan Aku Rela', 'Bila Selama Ini', 'Pulang'];

class SongSchedulerStep2 extends Component {

  render() {

    if (this.props.currentStep !== 2) { // Prop: The current step
      return null
    }

    return (
      <div className='container'>
        {this.props.displayedDates.map((dateList, i) => {
          return(
            <Table responsive>            
              <thead>
                <tr>
                  <th key={ i }>{ dateList.date } <Button onClick={this.addRow} className='ma1'>Add</Button></th>
                </tr>
              </thead>
              <tbody>
                <tr> 
                  <td>
                    <Form.Control as="select" required onChange={(event)=>this.props.handleSongChange(dateList, event)}>
                      <option>Choose...</option>
                      {
                        songNames.map((songName) => (<option>{ songName }</option>))
                      }
                    </Form.Control>
                  </td>
                </tr>
              </tbody>
            </Table>
          )
        })}        

      </div>
    )
  }
}
 
export default SongSchedulerStep2;

