import React, {useState, useEffect} from "react";
import "./Profile.css";
import sampleImage from "./logo192.png";
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";


const Profile = () => {
const [events, setEvents] = useState([]);
const userInfo = jwt_decode(getWithExpiry("user"));
useEffect (() => {
  let user = getWithExpiry("user");
  let userInfo = jwt_decode(user);
  if(userInfo === null){
    return <Navigate to='/Signup'/>
  }
  const getData = async () => {
    let res = await fetch ("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user?userid=" + userInfo.userid, {
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
}, [])


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

export default Profile;
