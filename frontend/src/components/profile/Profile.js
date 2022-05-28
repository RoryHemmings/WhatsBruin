import React, {useState, useEffect} from "react";
import "./Profile.css";
import sampleImage from "./logo192.png";
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";
import { Navigate, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";


const Profile = () => {
const [events, setEvents] = useState([]);
const [addedEvents, setAddedEvents] = useState([]);
const userInfo = jwt_decode(getWithExpiry("user"));
const [rerender, setRerender] = useState(false);
useEffect (() => {
  console.log("state called");
  let user = getWithExpiry("user");
  let userInfo = jwt_decode(user);
  if(userInfo === null){
    return <Navigate to='/Signup'/>
  }
  const getData = async () => {
    let res = await fetch ("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/createdevents?userid=" + userInfo.userid, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer ' + user,
    },
      method:"GET",
    })
    const status = res.status;
    res = await res.json();
    if(status < 400) {
      return res.events;
    }
    else {
      console.log("error");
    }
    setEvents(res.events);
  }
  getData().then(events => {
    console.log(events); setEvents(events)})
  const getAddedData = async () => {
    let res = await fetch ("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + user,
      },
        method:"GET",
      })
      const status = res.status;
      res = await res.json();
      if(status < 400) {
        return res.events;
      }
      else {
        console.log("error");
        return [];
      }
  }
  getAddedData().then(addedEvents => {
    console.log(addedEvents); setAddedEvents(addedEvents)})
}, [rerender])


const handleSubmit = async (eventid) => {
  console.log("begin");
  console.log("event.id: " + eventid);
  console.log("userInfo.id: " + userInfo.userid);

  let res = await fetch(
    "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/removeevent",
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

  setRerender(!rerender);
  console.log(rerender);
};

  return (
    <div className="App">
      <div className="profile-top">
        <div>
          <img src={sampleImage} alt="sample" />
        </div>
        <div>
          <h1 id="profile-name">{userInfo.username}</h1>
          <h3 id="profile-description">{userInfo.email}</h3>
          <br />
        </div>
      </div>
      <div className="profile-events">
        <Link to="/Manager" style={{ textDecoration: 'none' }}><h1 className="orange">My Created Events</h1></Link>
        {events?.map((event) => { }).length === 0 && "You have not created any events."}
        <div className="cards">
          {events?.map(event => {      
            return (
              <div className="card" key={event.id}>
                <div>
                  <h2>{event.title}</h2>
                  <h3>{event.date}</h3>
                  <h3>{event.starttime} - {event.endtime}</h3>
                  <h3>{event.description}</h3>
                  <h4>RSVPs: {event.num_attendee}</h4>
                </div>
              </div>
            );
          })}
          </div>
            <h1 className="orange">My Added Events</h1>
            {addedEvents?.map((event) => { }).length === 0 && "You have not added any events."}
        <div className="cards">
          {addedEvents?.map((event) => {
            return (
              <Grid
                className="card"
                key={event.id}
                noValidate
              >
                <div>
                  <h2>{event.title}</h2>
                  <h3>{event.date}</h3>
                  <h3>
                    {event.starttime} - {event.endtime}
                  </h3>
                  <h3>{event.description}</h3>
                </div>
                <div>
                  <Grid container justifyContent="center">
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={() => (handleSubmit(event.id))}
                      sx={{
                        marginTop: 4,
                        marginLeft: 4,
                        bgcolor: "#ffbbbb",
                        color: "#022A68",
                        fontWeight: "bold",
                      }}
                    >
                      remove
                    </Button>
                  </Grid>
                </div>
              </Grid>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
