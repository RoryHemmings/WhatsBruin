import Button from "@mui/material/Button";
import "./Landing.css";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="gradient white-text">
      <h2 style={{ paddingTop: 100, fontStyle: "italic", fontSize: 50 }}>
        welcome to
      </h2>
      <h1 className="gradient-text" style={{ fontSize: 150 }}>
        WhatsBruin
      </h1>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "baseline" }}>
        <div>
          <p style={{ marginTop: 100, fontSize: 30 }}>
            Get started by browsing<br/>UCLA events without signing in:
          </p>
          <div className="center">
            <Link to="/Calendar">
            <button class="landing-button">Public Calendar</button></Link>
          </div>
        </div>
        <div>
          <p style={{ marginTop: 100, fontSize: 30 }}>
            Or use WhatsBruin to publicize your events<br/>and save others you're interested in!
          </p>
          <div className="center">
            <Link to="/Signup">
            <button class="landing-button">Sign Up</button></Link>
            <Link to="/Login">
            <button class="landing-button">Log In</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
