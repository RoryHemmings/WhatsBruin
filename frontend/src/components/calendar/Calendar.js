import React, {useState, useEffect} from 'react';
import './Calendar.css';
//import FullCalendar from '@fullcalendar/react'; // must go before plugins
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


import { INITIAL_EVENTS, createEventId } from './Event-Utils'
import Filter from '../filter/Filter';

import * as ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import Box from '@material-ui/core/Box';

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
        // events={
        // //  url: "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/home?date=2022-05-22",
        // }
        weekends={this.state.weekendsVisible}
        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        //select={this.handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={this.handleEventClick}
        //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
      />
      </div>

  );
      }
//}


renderSidebar() {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={this.state.weekendsVisible}
            onChange={this.handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events ({this.state.currentEvents.length})</h2>
        <ul>
          {this.state.currentEvents.map(renderSidebarEvent)}
        </ul>
      </div>
    </div>
  )
}

handleWeekendsToggle = () => {
  this.setState({
    weekendsVisible: !this.state.weekendsVisible
  })
}

handleDateSelect = (selectInfo) => {
  let title = prompt('Please enter a new title for your event')
  let calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}

handleEventClick = (clickInfo) => {
  console.log(clickInfo.event.extendedProps.location);
  popup(clickInfo.event, {type: "info", timeout: 1000});
  // if (prompt(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //   clickInfo.event.remove()
  // }
}

handleEvents = (events) => {
  this.setState({
    currentEvents: events
  })
}

}

function renderEventContent(eventInfo) {
return (
  <>
    <b>{eventInfo.timeText}</b>
    <i>{eventInfo.event.title}</i>
  </>
)
}

function renderSidebarEvent(event) {
return (
  <li key={event.id}>
    <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
    <i>{event.title}</i>
  </li>
)
}


//popup

const node = document.createElement("div");
const popup = (Event, {type, timeout}) => {
  document.body.appendChild(node);
  var title = Event.title;
  var description = Event.extendedProps.description;
  var category = Event.extendedProps.category;
  var location = Event.extendedProps.location;
  console.log(description);
  const PopupContent = () => {
    return (

      <Popup type={type} open={true} timeout={timeout}>
            <div>
    <Box   flexDirection="column"  sx={{
         width: 300,
        // height: 300,
               }} color="white" bgcolor='#4997db' p={1}> 

               <h1 style={{ fontSize: "2rem" }}>
                 <span style = {{fontWeight: 'bold' }}> {title} </span>  {"\t"} 
                
                 </h1>
                 <h3>
            <br />
            <span style = {{fontWeight: 'bold' }}>Description:</span>  {"\t"} 
            <br />
      {description}
      <p>
      <br />
      {/* <br />
      <br />
      <br />
      <br /> */}
      <span style = {{fontWeight: 'bold' }}>Category:</span> {"\t"} 
      {category}
      <br />
      <br />
      <span style = {{fontWeight: 'bold' }}>Location:</span>  {"\t"} 
      {location}
      <br />
      <br />
      </p>
      </h3>
    </Box>
    </div>
    
      </Popup >

    );
  };

  
  ReactDOM.render(<PopupContent/>, node);
};