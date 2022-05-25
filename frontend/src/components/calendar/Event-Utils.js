
import React, {useState, useEffect} from "react";

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today



const Event = () => {
  const [events, setEvents] = useState([]);
  useEffect (() => {

    const getData = async () => {
      let res = await fetch ("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/home?date=2022-05-22", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        method:"GET",
      })
      const status = res.status;
      res = await res.json();
      if(status < 400) {
        return res.events;
      }
      else {
        console.log("error stuff");
      }
      setEvents(res.events);
      console.log("hi");
    }
    getData().then(events => {
      console.log(events); setEvents(events)})
  }, [])
  
  
    return (
      <div className="App">
        <div className="profile-top">
          <div>
          </div>
          <div>

            <br />
            {/* <h2 class="italics" id="profile-description">
              123 past events | 5 upcoming events
            </h2> */}
          </div>
        </div>
        <div className="profile-events">
          <h1 className="orange">My Upcoming Events</h1>
          <div className="cards">
            {events?.map(event => {      
              return (
                <div className="card" key={event.id}>
                  <div>
                    <h2>{event.title}</h2>
                    <h3>{event.date}</h3>
                    <h3>{event.starttime} - {event.endtime}</h3>
                    <h3>{event.description}</h3>
                  </div>
                </div>
              );
            })}
            </div>
        </div>
      </div>
    );
  };
  
  export default Event;

  export  const INITIAL_EVENTS = [
    {
      id: createEventId(),
      title: 'Event 1',
      start: todayStr,
      description: "This is a description",
      extendedProps: {
        location: "🏔 On the Hill",
        category: "⚽️ Sports",
  
      }
    },
    {
      id: createEventId(),
      title: 'Event 2',
      start: todayStr + 'T12:00:00',
      description: "Hello to who it may concern, if you are reading this please help me I am trapped in your computer. I am not sure where exactly as it is very dark her but I am sure that if you smash your computer I will be released. Hurry ...",
      // extendedProps: {
      //   location: "🏫 On Campus",
      //   category: "📚 Academics",
  
      // }
      
    }
  ]



export function createEventId() {
  return String(eventGuid++)
}