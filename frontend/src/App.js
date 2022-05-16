import './App.css';
import './components/calendar/Calendar.css';
import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import {Route, Routes} from "react-router-dom"
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home'
import Calendar from './components/calendar/Calendar'
import Search from './components/search/Search';
import Profile from './components/profile/Profile';



function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home/>}></Route>
        <Route path="/Search" element={<Search/>}></Route>
        <Route path="/Calendar" element={<Calendar/>}></Route>
        <Route path="/Profile" element={<Profile/>}></Route>
      </Routes>
    </div>

  );
}

export default App;
