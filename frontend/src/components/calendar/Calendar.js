import React from 'react';
import './Calendar.css';
//import FullCalendar from '@fullcalendar/react'; // must go before plugins
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import Typography from '@mui/material/Typography';

//import { INITIAL_EVENTS, createEventId } from './src/components/calendar/Event-Utils.js'
import Filter from '../filter/Filter';


export default class Calendar extends React.Component {

  state = {
    weekendsVisible: true,
    currentEvents: []
  }

  render() {
  return (
    <div className="App">
      <Filter/>
      <FullCalendar
        //<Typography textAlign="center"><Link style={{textDecoration: "none", color:"cornflowerblue"}} to={`/${setting}`}>{setting}</Link></Typography>
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView='dayGridMonth'
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        
        property = {{
          contentHeight: 550,
        }}
        //weekends={this.state.weekendsVisible}
        //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        //select={this.handleDateSelect}
        //eventContent={renderEventContent} // custom render function
        //eventClick={this.handleEventClick}
        //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
      />
      </div>
  );
      }
}
