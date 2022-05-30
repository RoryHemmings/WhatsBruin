import React, { useState} from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import '../profile/Profile.css'
import { getWithExpiry } from "../../Token";
import jwtDecode from "jwt-decode";

export default function Search() {
  const [value, setValue] = useState("");
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  let userInfo;
  const user = getWithExpiry("user")
  user ? userInfo = jwtDecode(user) : userInfo = null

  const handleSearch = async (value) => {
    if (value === "") {
      setEvents([]);
      return;
    }
    let res = await fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/search?title=" + value, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET",
    })
    const status = res.status
    res = await res.json();
    if (status === 200) {
      console.log("works");
      console.log(res);
      setEvents(res);
    }
    else {
      alert("error!");
    }
    if (userInfo !== null) {
      let res2 = await fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user,
        },
        method: "GET",
      })
      const status = res2.status;
      res2 = await res2.json();
      if (status < 400) {
        setUserEvents(res2.events);
      }
      else {
        console.log("error");
        setUserEvents([]);
      }
        let res3 = await fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/createdevents?userid=" + userInfo.userid, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + user,
            },
            method: "GET",
          })
          const new_status = res3.status;
          res3 = await res3.json();
          if (new_status < 400) {
            setCreatedEvents(res3.events);
          }
          else {
            console.log("error");
            setCreatedEvents([]);
          }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (value === "") {
      setEvents([]);
      return;
    }
    handleSearch(value);
  };

  const handleDelete = async (eventid) =>{
    console.log("begin");
  console.log("event.id: " + eventid);
  console.log("userInfo.id: " + userInfo.userid);

  let res = await fetch(
    "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/removeevent",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        eventid: eventid,
        userid: userInfo.userid,
      }),
    }
  );

  const status = res.status;
  res = await res.json();

  if (status < 400) {
    console.log("works");
    console.log(res);
  } else {
    alert(res.message);
    alert("error stuff");
  }
  handleSearch(value);
};


  const handleAdd = async (eventid) => {
    console.log("begin");
    console.log("event.id: " + eventid);
    console.log("userInfo.id: " + userInfo.userid);
  
    let res = await fetch(
      "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/addevent",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          eventid: eventid,
          userid: userInfo.userid,
        }),
      }
    );
  
    const status = res.status;
    res = await res.json();
  
    if (status < 400) {
      console.log("works");
      console.log(res);
    } else {
      alert(res.message);
      alert("error stuff");
    }
    handleSearch(value);
  };

  const FindEvent = (key) => {
    if(createdEvents.some(event=>event.id===key.event)){
      return <button id="delete-button">my created event</button>
    }
    if(userEvents.some(event=>event.id===key.event)){
      return <button id="delete-button" onClick={function(){handleDelete(key.event)}}>remove</button>
    }
    return <button id="delete-button" onClick={function(){handleAdd(key.event)}}>add</button>;
  };

  const changeHandler = e => {
    setValue(e.target.value);
  };


  return (
    <div className='App'>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 300, marginTop: 3 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for an event"
          inputProps={{ 'aria-label': 'Search for an event' }}
          id="value"
          name="value"
          value={value ?? ""}
          onChange={changeHandler}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={handleSubmit}>
          <SearchIcon />
        </IconButton>
      </Paper>
      <div className="cards">
        {events?.map(event => {
          return (
            <div className="card" key={event.id}>
              <div>
                <h2>{event.title}</h2>
                <h3>{event.organizeruser}</h3>
                <h3>{event.date}</h3>
                <h3>{event.starttime} - {event.endtime}</h3>
                <h3>{event.description}</h3>

                {user ? (
                  <FindEvent event={event.id}/>
                ) : (
                  <></>
                )
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
