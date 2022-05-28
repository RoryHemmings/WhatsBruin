import React, { useState, useEffect } from "react";
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const DeleteEvent = () => {
  const [events, setEvents] = useState([]);
  const userInfo = jwt_decode(getWithExpiry("user"));
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let user = getWithExpiry("user");
    let userInfo = jwt_decode(user);
    const getData = async () => {
      let res = await fetch(
        "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user/createdevents?userid=" +
          userInfo.userid,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + user,
          },
          method: "GET",
        }
      );
      const status = res.status;
      res = await res.json();
      if (status < 400) {
        return res.events;
      } else {
        console.log("error stuff");
      }
      setEvents(res.events);
    };
    getData().then((events) => {
      console.log(events);
      setEvents(events);
    });
  }, [rerender]);

  const handleSubmit = async (eventid) => {
    console.log("begin");
    console.log("event.id: " + eventid);
    console.log("userInfo.id: " + userInfo.userid);

    let res = await fetch(
      "http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/event/delete",
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

    // TODO: remove
    if (status === 200) {
      console.log("works");
      console.log(res);
    } else {
      alert(res.message);
      alert("error stuff");
    }

    setRerender(!rerender);
  };

  return (
    <div className="App">
      <div className="profile-top"></div>
      <div className="profile-events">
      {events?.map((event) => { }).length === 0 && "You have not created any events."}
        <div className="cards">
          {events?.map((event) => {
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
                      onClick={() => handleSubmit(event.id)}
                      sx={{
                        marginTop: 4,
                        marginLeft: 4,
                        bgcolor: "#ffbbbb",
                        color: "#022A68",
                        fontWeight: "bold",
                      }}
                    >
                      delete
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

export default DeleteEvent;
