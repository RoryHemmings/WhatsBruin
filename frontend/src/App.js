import './App.css';
import React from 'react';
//import FullCalendar from '@fullcalendar/react' // must go before plugins
//import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import {Route, Routes} from "react-router-dom"
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home'
import Calendar from './components/calendar/Calendar'
import Manager from './components/manager/Manager';
import Profile from './components/profile/Profile';
import Signup from './components/account/Signup';
import Login from './components/account/Login';
import Logout from './components/account/Logout';
import Search from './components/search/Search';
import Landing from './components/landing/Landing';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
      <Route path="/" element={<Calendar/>}></Route>
        <Route path="/Landing" element={<Landing/>}></Route> 
        <Route path="/Calendar" element={<Home/>}></Route>
        <Route path="/Manager" element={<Manager/>}></Route>
        <Route path="/Profile" element={<Profile/>}></Route>
        <Route path="/Signup" element={<Signup/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/Logout" element={<Logout/>}></Route>
        <Route path="/Search" element={<Search/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
