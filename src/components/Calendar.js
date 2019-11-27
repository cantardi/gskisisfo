import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

class MyCalendar extends React.Component {
	
	state = {
		schedule: []
	}

	componentDidMount() {
		fetch(process.env.REACT_APP_BACKEND_URL + '/getschedulebyservant/7', {
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
					<Calendar
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

export default MyCalendar;