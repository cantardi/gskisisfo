import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { userContext } from '../helpers/userContext';
import MessageModal from './MessageModal';
import { DateConvert } from '../helpers/function';

const localizer = momentLocalizer(moment)

class MyCalendar extends React.Component {
	
	state = {
		schedule: [],
		width: [],
		msgModalShow: false,
		msgModalHeader: '',
		msgModalContent: ''
	}

	selectEvent = (e) => {
		this.setState({ msgModalShow: true, 
										msgModalHeader: DateConvert(new Date(e.startDate)), 
										msgModalContent: "Anda melayani sebagai " + e.title + " di " + e.session })
	}

	assessSize = (e) => {
		if (this.state.width <= 760)
			return e.shortTitle;
		else
			return e.title;
	}

	msgModalClose = () => {
		this.setState({ msgModalShow: false })
	}

	componentDidMount() {
		let user = this.context;
		
		fetch(process.env.REACT_APP_BACKEND_URL + '/getschedulebyservant/' + user.id, {
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
								allDay: true,
								startDate: new Date (event.predefineddate),
								endDate: new Date (event.predefineddate),
								title: event.roledescr,
								shortTitle: event.roleshortdescr,
								session: event.description
							})
						)
					})

					this.setState({ schedule })
				})
      }
    }) 
    .catch(err => console.log("Fail to call getschedulebyservant api: " + err))
		
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}
	
	componentWillUnmount = () => {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}
	
	updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth });
	}

	render() {

		return (
			<div>
				<Calendar
					 style={{height: 500}}
					 culture='en-GB'
					 localizer={localizer}
					 events={this.state.schedule}
					 titleAccessor={this.assessSize}
					 views={['month']}
					 startAccessor="startDate"
					 endAccessor="endDate"
					 onSelectEvent={this.selectEvent}
			 	/>

				<MessageModal
          show={ this.state.msgModalShow }
          onHide={ this.msgModalClose }
          headerText={ this.state.msgModalHeader }
          contentText1={ this.state.msgModalContent }
        />
			</div>
		)
	}
  
}

MyCalendar.contextType = userContext;
export default MyCalendar;