import './App.css';
import React from 'react';
import {Route, Routes} from "react-router-dom"
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home'
import Calendar from './components/calendar/Calendar'
import Manager from './components/manager/Manager';
import Profile from './components/profile/Profile';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home/>}></Route>
        <Route path="/Calendar" element={<Calendar/>}></Route>
        <Route path="/Manager" element={<Manager/>}></Route>
        <Route path="/Profile" element={<Profile/>}></Route>
      </Routes>
    </div>

  );
}

export default App;
