import React from "react";
import  { Navigate } from 'react-router-dom'

export default function Logout() {
    localStorage.clear();
    window.onload = function() {
        if(!window.location.hash) {
            window.location = window.location + '#loggedOut';
            window.location.reload();
        }
    }
    window.onload();
    return <Navigate to='/'  />

}