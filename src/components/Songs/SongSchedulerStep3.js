import React, { Component } from "react";
import { Table } from "react-bootstrap";

class SongSchedulerStep3 extends Component {
  
  render() {

    if (this.props.currentStep !== 3) { // Prop: The current step
      return null
    }

    return (
      <div className='container'>

        {this.props.displayedDates.map((dateList, i) => {
          return(
            <Table responsive>            
              <thead>
                <tr>
                  <th key={ dateList.id }>{ dateList.date }</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.selectedSong
                    .filter(songList => songList.serviceDateId===dateList.id)
                    .map((songList, j) => {
                      return(
                        <tr key={ j }>
                          <td>{ songList.songName }</td>
                        </tr>
                      )
                    })
                    
                }
              </tbody>
            </Table>
          )
        })}        

      </div>
    )
  }
}
 
export default SongSchedulerStep3;

