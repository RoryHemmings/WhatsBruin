import React from "react";
import "./Profile.css";
import sampleImage from "./logo192.png";

const Profile = () => {
  return (
    <div className="App">
      <div class="profile-top">
        <div>
          <img src={sampleImage} alt="sample" />
        </div>
        <div>
          <h1 id="profile-name">Organization Name</h1>
          <h3 id="profile-description">organization description</h3>
          <br />
          <h2 class="italics" id="profile-description">
            123 past events | 5 upcoming events
          </h2>
        </div>
      </div>
      <div class="profile-events">
        <h1 class="orange">My Upcoming Events</h1>
        <div class="cards">
          <div class="card">
            <div>
              <h2>Event 1 Name</h2>
              <h3>Date</h3>
              <h3>Time</h3>
              <h3>Description</h3>
            </div>
            <div class="buttons">
              <button id="edit-button">Edit Event</button>
              <button id="delete-button">Delete Event</button>
            </div>
          </div>
          <div class="card">
            <div>
              <h2>Event 2 Name</h2>
              <h3>Date</h3>
              <h3>Time</h3>
              <h3>Description</h3>
            </div>
            <div class="buttons">
              <button id="edit-button">Edit Event</button>
              <button id="delete-button">Delete Event</button>
            </div>
          </div>
          <div class="card">
            <div>
              <h2>Event 3 Name</h2>
              <h3>Date</h3>
              <h3>Time</h3>
              <h3>Description</h3>
            </div>
            <div class="buttons">
              <button id="edit-button">Edit Event</button>
              <button id="delete-button">Delete Event</button>
            </div>
          </div>
          <div class="card">
            <div>
              <h2>Event 4 Name</h2>
              <h3>Date</h3>
              <h3>Time</h3>
              <h3>Description</h3>
            </div>
            <div class="buttons">
              <button id="edit-button">Edit Event</button>
              <button id="delete-button">Delete Event</button>
            </div>
          </div>
          <div class="card">
            <div>
              <h2>Event 5 Name</h2>
              <h3>Date</h3>
              <h3>Time</h3>
              <h3>Description</h3>
            </div>
            <div class="buttons">
              <button id="edit-button">Edit Event</button>
              <button id="delete-button">Delete Event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
