import React, { Component } from "react";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const Calendar = props => {
  const dummyEvents = [
		{
		  allDay: false,
		  endDate: new Date('April 13, 2019 11:13:00'),
		  startDate: new Date('April 13, 2019 11:13:00'),
		  title: 'hi',
		},
		{
		  allDay: true,
		  endDate: new Date('April 09, 2019 11:13:00'),
		  startDate: new Date('April 09, 2019 11:13:00'),
		  title: 'All Day Event',
		},
	];
  return (
     <div>
         <BigCalendar
          style={{height: 500}}
          localizer={localizer}
          events={dummyEvents}
          views={['month']}
          startAccessor="startDate"
          endAccessor="endDate"
        />
     </div>
  )
}

export default Calendar;