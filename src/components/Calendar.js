import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Spinner } from 'react-bootstrap';
import { DateConvert } from '../helpers/function';
import { authenticationService } from '../services/authenticationService';
import moment from 'moment';
import MessageModal from './MessageModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
		let msg = ["Your role in ", <strong key="1">{e.session}</strong>, " is as ", <strong key="2">{e.title}</strong>]
		this.setState({ msgModalShow: true, 
										msgModalHeader: DateConvert(new Date(e.startDate)), 
										msgModalContent: msg })
	}

	eventStyleGetter = () => {
		return {
			style: {
				backgroundColor: '#10389e',
  			borderColor: '#10389e'
			}
		}
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
		let user = authenticationService.currentUser;
		
		fetch(process.env.REACT_APP_BACKEND_URL + '/getschedulebyservant/' + user.source._value.servantid, {
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

		return(
			<div>
				{
					(this.state.schedule.length > 0)?
					(
						<div>
							<Calendar
								style={{height: 500}}
								eventPropGetter={(this.eventStyleGetter)}
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
					):
					(
						<div className="tc pa4">
							<Spinner animation="grow" variant="primary" role="status">
								<span className="sr-only">Loading...</span>
							</Spinner> 
							<div>Loading...</div>
						</div>
					)
				}
			</div>
		)
		

	}
  
}

export default MyCalendar;
