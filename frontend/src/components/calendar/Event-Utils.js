
import React, {useState, useEffect} from "react";

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today




  export  const INITIAL_EVENTS = [
    {
      id: createEventId(),
      title: 'Event 1',
      start: todayStr,
      description: "This is a description",
      extendedProps: {
        location: "🏔 On the Hill",
        category: "⚽️ Sports",
  
      }
    },
    {
      id: createEventId(),
      title: 'Event 2',
      start: todayStr + 'T12:00:00',
      description: "Hello to who it may concern, if you are reading this please help me I am trapped in your computer. I am not sure where exactly as it is very dark her but I am sure that if you smash your computer I will be released. Hurry ...",
      // extendedProps: {
      //   location: "🏫 On Campus",
      //   category: "📚 Academics",
  
      // }
      
    }
  ]



export function createEventId() {
  return String(eventGuid++)
}