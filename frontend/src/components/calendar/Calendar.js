import React from 'react';
import './Calendar.css';
//import FullCalendar from '@fullcalendar/react'; // must go before plugins
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


import { INITIAL_EVENTS, createEventId } from './Event-Utils'
import Filter from '../filter/Filter';

import * as ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import Box from '@material-ui/core/Box';

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
  this.state = {
    needPass: true,
    weekendsVisible: true,
    currentEvents: []
  }
  }

  componentDidMount() {
    fetch("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/home?date="+ todayStr, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        method:"GET",
      })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            currentEvents: result.events})
      });
 
  }


  render() {
    const { weekendsVisible, currentEvents } = this.state;
  


    var eventList= [];
    eventList = currentEvents.map(eventItem => {
        return {

          id: eventItem.id,
          title: eventItem.title,
          start: eventItem.date + 'T' + eventItem.starttime + ":00",
          end: eventItem.date + 'T' + eventItem.endtime + ":00",
          description: eventItem.description,
          extendedProps: {
            location: eventItem.location,
            category: eventItem.tags,
            weekday: eventItem.weekday,
            num_attendee: eventItem.num_attendee,
            organizer: eventItem.organizer,
            organizeruser: eventItem.organizeruser
           }
          }; 

    });



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

        weekends={this.state.weekendsVisible}
        
        events={eventList} // alternatively, use the `events` setting to fetch from a feed
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


handleEventClick = (clickInfo) => {

  popup(clickInfo.event, {type: "info", timeout: 1000});

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




//popup

const node = document.createElement("div");
const popup = (Event, {type, timeout}) => {
  document.body.appendChild(node);
  var title = Event.title;
  var description = Event.extendedProps.description;
  var category = Event.extendedProps.category;
  var location = Event.extendedProps.location;
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


