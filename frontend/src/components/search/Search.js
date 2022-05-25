import React, { useState} from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import '../profile/Profile.css'

export default function Search() {
  const [value, setValue] = useState("");
  const [events, setEvents] = useState([]);
  const changeHandler = e => {
    setValue(e.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(value === ""){
      setEvents([]);
      return;
    }
    let res = await fetch ("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/search?title=" + value, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method:"GET",
    })
    const status = res.status
    res = await res.json();
    if(status === 200){
      console.log("works");
      console.log(res);
      setEvents(res);
    }
    else{
      alert("error!");
    }
  }
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
        id = "value"
        name = "value"
        value = {value ?? ""}
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
                </div>
              </div>
            );
          })}
          </div>
    </div>
  );
}
