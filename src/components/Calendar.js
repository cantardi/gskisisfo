import React from "react";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class Calendar extends React.Component {
	
	state = {
		schedule: []
	}

	componentDidMount() {
		fetch('http://localhost:3001/getschedulebyservant/7', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
    })
    .then (response => {
      if (response.status === 200){
        return response.json()
        .then(data => {
					
					let { schedule } = this.state

					data.map(event => {
						return (
							schedule.push({
								allDay: false,
								startDate: new Date (event.predefineddate),
								endDate: new Date (event.predefineddate),
								title: event.rolename
							})
						)
					})

					this.setState({ schedule })
				})
      }
    }) 
    .catch(err => console.log("Fail to call getschedulebyservant api: " + err))
    
	}

	render() {
		return (
			<div>
					<BigCalendar
					 style={{height: 500}}
					 culture='en-GB'
					 localizer={localizer}
					 events={this.state.schedule}
					 views={['month']}
					 startAccessor="startDate"
					 endAccessor="endDate"
				 />
			</div>
		)
	}
  
}

export default Calendar;