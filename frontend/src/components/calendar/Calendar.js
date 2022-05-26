import React from 'react';
import './Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";

import { INITIAL_EVENTS, createEventId } from './Event-Utils'
import Filter from '../filter/Filter';

import * as ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import Box from '@material-ui/core/Box';
import { isOptionGroup } from '@mui/base';
let userInfo = getWithExpiry("user");
if (userInfo) {
  userInfo = jwt_decode(userInfo);
}
let personalizedEvents = [];

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      needPass: true,
      currentEvents: [],
      open: true,
    }
  }


  componentDidMount() {
    fetch("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/home?date=" + todayStr, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            currentEvents: result.events
          })
        });
    const getJWT = async () => {
      userInfo = getWithExpiry("user");
      if (userInfo) {
        userInfo = jwt_decode(userInfo);
        console.log("userinfo", userInfo);
      }
    }
    if (userInfo) {
      (async () => {
        let res = await fetch(
          "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );
        const status = res.status;
        res = await res.json();
        if (status === 200) {
          console.log("works");
          personalizedEvents = res.events.map((event) => { return event.id });
        } else {
          alert(res.message);
          alert("error");
        }
      })();
    }
  }

  render() {
    const { currentEvents } = this.state;

    var eventList = [];
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

        <Filter />
        <FullCalendar
          //<Typography textAlign="center"><Link style={{textDecoration: "none", color:"cornflowerblue"}} to={`/${setting}`}>{setting}</Link></Typography>
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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

          property={{
            contentHeight: 550,
          }}
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
  alteropen = (status) => {
    this.setState({ open: status });
  }
  handleEventClick = (clickInfo) => {
    popup(clickInfo.event, { type: "info", timeout: 1000 }, this.state.open, this.alteropen);
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }
}
//end of calendar class

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
const popup = (Event, { type, timeout }, isOpen, setOpen) => {
  document.body.appendChild(node);
  var title = Event.title;
  var description = Event.extendedProps.description;
  var category = Event.extendedProps.category;
  var location = Event.extendedProps.location;
  let open = isOpen;
  function checkAdded() {
    return personalizedEvents.includes(Event.id);
  }
  async function addevent() {
    if (!userInfo) return;
    if (!userInfo.userid) return;
    let res = await fetch(
      "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/addevent",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          eventid: Event.id,
          userid: String(userInfo.userid),
        }),
      }
    );

    const status = res.status;
    res = await res.json();

    // TODO: remove
    if (status === 201) {
      console.log("works");
      console.log(res);
    } else {
      alert(res.message);
      alert("error");
    }
    open = false;

    let updatePersonalizedEvents = await fetch(
      "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    updatePersonalizedEvents = await updatePersonalizedEvents.json();

    personalizedEvents = updatePersonalizedEvents.events.map((event) => { return event.id });
    setTimeout( ()=>{
      ReactDOM.render(<PopupContent />, node);
    }, 150);

  }
  async function removeevent() {
    if (!userInfo) return;
    if (!userInfo.userid) return;
    let res = await fetch(
      "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/removeevent",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          eventid: Event.id,
          userid: String(userInfo.userid),
        }),
      }
    );

    const status = res.status;
    res = await res.json();

    // TODO: remove
    if (status === 201) {
      console.log("works");
      console.log(res);
    } else {
      alert(res.message);
      alert("error");
    }
    open = false;
    let updatePersonalizedEvents = await fetch(
      "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    updatePersonalizedEvents = await updatePersonalizedEvents.json();

    personalizedEvents = updatePersonalizedEvents.events.map((event) => { return event.id });

    setTimeout( ()=>{
      ReactDOM.render(<PopupContent />, node);
    }, 150);
  }
  const PopupContent = () => {
    return (

      <Popup type={type} open={open} timeout={timeout}>
        <div>
          <Box flexDirection="column" sx={{
            width: 300,
            // height: 300,
          }} color="white" bgcolor='#4997db' p={1}>

            <h1 style={{ fontSize: "2rem" }}>
              <span style={{ fontWeight: 'bold' }}> {title} </span>  {"\t"}

            </h1>
            <h3>
              <br />
              <span style={{ fontWeight: 'bold' }}>Description:</span>  {"\t"}
              <br />
              {description}
              <p>
                <br />

                <span style={{ fontWeight: 'bold' }}>Category:</span> {"\t"}
                {category}
                <br />
                <br />
                <span style={{ fontWeight: 'bold' }}>Location:</span>  {"\t"}
                {location}
                <br />
                <br />
              </p>
              {userInfo ?
                (
                  !checkAdded() ? (
                    <>
                      <button onClick={() => { addevent() }}>add event to my calendar</button>
                    </>
                  ) : (
                    <button onClick={() => { removeevent() }}>remove event from my calendar</button>
                  )
                ) : (
                  <>
                  </>
                )
              }

            </h3>
          </Box>
        </div>
      </Popup >

    );
  };


  ReactDOM.render(<PopupContent />, node);
};


