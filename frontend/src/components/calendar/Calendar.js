import React from 'react';
import './Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";
import Filter from '../filter/Filter';
 
import * as ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import Box from '@material-ui/core/Box';
let userInfo = getWithExpiry("user");
if (userInfo) {
 userInfo = jwt_decode(userInfo);
}
let personalizedEvents = [];
 
const todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
export default class Calendar extends React.Component {
 
 constructor(props) {
   super(props);
   this.state = {
     categories: [],
     locations: [],
     dates: [],
     times: [],
     needPass: true,
     month1: [],
     currentEvents: [],
     month3: [],
     open: true,
     calDate: todayStr
   }
   this.update=this.update.bind(this);
 }
 componentDidMount() {
   fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/home?date=" + todayStr, {
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     method: "GET",
   })
     .then((res) => {
       if(res.status < 400)
       return res.json();
     })
     .then(
       (result) => {
         // console.log("bloke");
         if (!(result.message === "no events in this month")){
           this.setState({
             currentEvents: result.events,
           })
         }
 
       });
   const getJWT = async () => {
     userInfo = getWithExpiry("user");
     if (userInfo) {
       userInfo = jwt_decode(userInfo);
       //console.log("userinfo", userInfo);
     }
   }
   if (userInfo) {
     (async () => {
       let res = await fetch(
         "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid,
         {
           headers: {
             "Accept": "application/json",
             "Content-Type": "application/json",
           },
           method: "GET",
         }
       );
       const status = res.status;
       res = await res.json();
       if (status === 200) {
         //console.log("works");
         personalizedEvents = res.events?.map((event) => { return event.id });
       } else {
         alert(res.message);
         alert("error");
       }
     })();
   }
 }
 
 update(nextState) {
   this.setState(nextState);
 }
 
 render() {
   const { currentEvents, categories, locations, dates, times, month1, month3 } = this.state;
   //console.log(month1);
   var currentEVENTS = currentEvents?.concat(month1!==undefined ? month1 : [], month3!==undefined ? month3 : []);
   currentEVENTS = currentEVENTS?.filter((value, index, self) =>
   index === self.findIndex((t) => (
     t.id === value.id
   )));
   var eventList = [];
   eventList = currentEVENTS?.map(eventItem => {
     return {
       id: eventItem.id,
       title: eventItem.title,
       start: eventItem.date + 'T' + eventItem.starttime + ":00",      //YYYY-MM-DD-T-HH-MM-SS
       end: eventItem.date + 'T' + eventItem.endtime + ":00",
       description: eventItem.description,
       extendedProps: {
         location: eventItem.location,
         category: eventItem.tags,
         weekday: eventItem.weekday,
         num_attendee: eventItem.num_attendee,
         organizer: eventItem.organizer,
         organizeruser: eventItem.organizeruser
       }
     };
   });
 
   // console.log(categories);
   // console.log(locations);
   // console.log(dates);
   // console.log(times);
 
   var filteredEvents = [];
   eventList?.forEach((event)=>{
     var hour = event.start.substring(11,13);
     var time = "";
     if ((hour >= 6) && (hour <= 11)){
       time = "🌆 Morning";
     }
     else if ((hour >= 12) && (hour <= 17)){
       time = "🏙 Afternoon";
     }
     else {
       time = "🌃 Night";
     }
 
     if ((categories.length === 0) || (categories.includes(event.extendedProps.category[0]))){
       if ((locations.length === 0) || (locations.includes(event.extendedProps.location))){
         if ((dates.length === 0) || (dates.includes(event.extendedProps.weekday))){
           if ((times.length === 0) || (times.includes(time))){
             filteredEvents.push(event);
           }
         }
       }
     }
   });
 
   //console.log(filteredEvents);
 
 
   return (
 
     <div className="App" style={{paddingBottom:20, paddingTop:20}}>
 
       <Filter updateParent={this.update}/>
       <FullCalendar
         //<Typography textAlign="center"><Link style={{textDecoration: "none", color:"cornflowerblue"}} to={`/${setting}`}>{setting}</Link></Typography>
         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
         headerToolbar={{
           left: 'prev,next today',
           center: 'title',
           right: 'dayGridMonth,timeGridWeek,timeGridDay'
         }}
         initialView='dayGridMonth'
         editable={true}
         selectable={true}
         selectMirror={true}
         dayMaxEvents={true}
         datesSet={(args) => {
           let monthDate = ("###datesSet:", args).startStr.substring(0, 10); //YYYY-MM-DD
                                                                             //0123456789
           var correctMonth =  parseInt(monthDate.substring(5, 7), 10);
           var correctMonthBefore = (correctMonth - 1) ;
           var correctMonthAfter = (correctMonth + 1);
           var correctYear = monthDate.substring(0, 4);
           var yearAfter = parseInt(monthDate.substring(0, 4), 10) + 1;
           var yearBefore = yearAfter - 2;
           var needed = false;
           var neededBefore = false;
           var neededBEFORE = false;
           var neededAfter = false;
 
           if (parseInt(monthDate.substring(8, 11), 10) > 10) {
             correctMonth = parseInt(monthDate.substring(5, 7), 10) + 1;
             correctMonthBefore = correctMonth - 1;
             correctMonthAfter = correctMonth + 1;
           }
           correctYear = monthDate.substring(0, 4);
 
             if (correctMonth < 10){
               correctMonth = "0" + correctMonth;
             }
             else if (correctMonth === 13){
               correctMonth = "01";
               needed = true;
             }
 
 
             if ((correctMonthBefore < 10) && (correctMonthBefore !== 0)){
               correctMonthBefore = "0" + correctMonthBefore;
             }
             else if (correctMonthBefore === 13){
               correctMonthBefore = "01";
               neededBefore = true;
             }
             else if (correctMonthBefore === 0){
               correctMonthBefore = "12";
               neededBEFORE = true;
             }
 
             if ((correctMonthAfter < 10) && (correctMonthAfter !== 0)){
               correctMonthAfter = "0" + correctMonthAfter;
             }
             else if (correctMonthAfter === 13){
               correctMonthAfter = "01";
               neededAfter = true;
             }
             else if (correctMonthAfter === 14){
               correctMonthAfter = "02";
               neededAfter = true;
             }
          
 
             if (neededBefore){
               var monthDateBefore = yearAfter + "-" + correctMonthBefore + "-01";
             }
             else if (neededBEFORE){
               var monthDateBefore = yearBefore + "-" + correctMonthBefore + "-01";
             }
             else {
               var monthDateBefore = correctYear + "-" + correctMonthBefore + "-01";
             }
 
             if (needed){
               monthDate = yearAfter + "-" + correctMonth + "-01";
             }
             else {
               monthDate = correctYear + "-" + correctMonth + "-01";
             }
 
             if (neededAfter){
               var monthDateAfter = yearAfter + "-" + correctMonthAfter + "-01";
             }
             else {
               var monthDateAfter = correctYear + "-" + correctMonthAfter + "-01";
             }
            // console.log(monthDateBefore);
           fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/home?date=" + monthDate, {
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
             },
             method: "GET",
           })
             .then((res) => res.json())
             .then(
               (result) => {
                   this.setState({
                     currentEvents: result.events
                   })
                 }
               );
           fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/home?date=" + monthDateBefore, {
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
             },
             method: "GET",
           })
             .then((res) => res.json())
             .then(
               (result) => {
                   this.setState({
                     month1: result.events
                   })
                 }
               );
           fetch("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/home?date=" + monthDateAfter, {
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
             },
             method: "GET",
           })
             .then((res) => res.json())
             .then(
               (result) => {
                   this.setState({
                     month3: result.events
                   })
                 }
               );
         }}
         events={filteredEvents}
         eventContent={renderEventContent} // custom render function
         eventClick={this.handleEventClick}
       />
     </div>
 
   );
 }
 alteropen = (status) => {
   this.setState({ open: status });
 }
 handleEventClick = (clickInfo) => {
   popup(clickInfo.event, { type: "info", timeout: 1000 }, this.state.open, this.alteropen);
 }
}
//end of calendar class
 
function renderEventContent(eventInfo) {
 return (
   <>
     <b>{eventInfo.timeText}</b>
     <i>{eventInfo.event.title}</i>
   </>
 )
}
 
 
 
//popup
 
const node = document.createElement("div");
const popup = (Event, { type, timeout }, isOpen, setOpen) => {
 document.body.appendChild(node);
 var title = Event.title;
 var description = Event.extendedProps.description;
 var category = Event.extendedProps.category;
 var location = Event.extendedProps.location;
 var organizer = Event.extendedProps.organizeruser;
 let open = isOpen;
 function checkAdded() {
   return personalizedEvents.includes(Event.id);
 }
 async function addevent() {
   if (!userInfo) return;
   if (!userInfo.userid) return;
   let res = await fetch(
     "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/addevent",
     {
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       method: "POST",
       body: JSON.stringify({
         eventid: Event.id,
         userid: String(userInfo.userid),
       }),
     }
   );
 
   const status = res.status;
   res = await res.json();
 
   // TODO: remove
   if (status === 201) {
     //console.log("works");
     //console.log(res);
   } else {
     alert(res.message);
     alert("error");
   }
   open = false;
 
   let updatePersonalizedEvents = await fetch(
     "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid,
     {
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       method: "GET",
     }
   );
   updatePersonalizedEvents = await updatePersonalizedEvents.json();
 
   personalizedEvents = updatePersonalizedEvents.events?.map((event) => { return event.id });
   setTimeout(() => {
     ReactDOM.render(<PopupContent />, node);
   }, 150);
 
 }
 async function removeevent() {
   if (!userInfo) return;
   if (!userInfo.userid) return;
   let res = await fetch(
     "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/removeevent",
     {
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       method: "POST",
       body: JSON.stringify({
         eventid: Event.id,
         userid: String(userInfo.userid),
       }),
     }
   );
 
   const status = res.status;
   res = await res.json();
 
   // TODO: remove
   if (status === 201) {
     //console.log("works");
     //console.log(res);
   } else {
     alert(res.message);
     alert("error");
   }
   open = false;
   let updatePersonalizedEvents = await fetch(
     "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/user/addedevents?userid=" + userInfo.userid,
     {
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       method: "GET",
     }
   );
   updatePersonalizedEvents = await updatePersonalizedEvents.json();
 
   personalizedEvents = updatePersonalizedEvents.events.map((event) => { return event.id });
 
   setTimeout(() => {
     ReactDOM.render(<PopupContent />, node);
   }, 150);
 }
 const PopupContent = () => {
   return (
 
     <Popup type={type} open={open} timeout={timeout}>
       <div>
       <Box
            flexDirection="column"
            sx={{
              // width: 450,
              paddingX: 3,
              borderRadius: 10,
              marginX: 3,
            }}
            color="white"
            bgcolor="#4997db"
            p={1}
          >
 
           <h1 style={{ fontSize: "2rem" }}>
             <span style={{ fontWeight: 'bold' }}> {title} </span>  {"\t"}
 
           </h1>
           <h3>
           Organizer: {organizer}
             <br />
             <span style={{ fontWeight: "bold", color: "#FFEEAE" }}>
                Description:
              </span>{" "}
              {"\t"}
             {description}
             <p>
               <br />
               <span style={{ fontWeight: 'bold' }}>Category:</span> {"\t"}
               {category}
               <br />
               <br />
               <span style={{ fontWeight: 'bold' }}>Location:</span>  {"\t"}
               {location}
               <br />
               <br />
             </p>
             {userInfo ?
               (
                 !checkAdded() ? (
                   <>
                     <button className="popup-add-button" onClick={addevent}>add event to my calendar</button>
                   </>
                 ) : (
                   <button className="popup-remove-button" onClick={removeevent}>remove event from my calendar</button>
                 )
               ) : (
                 <>
                 </>
               )
             }
 
           </h3>
         </Box>
       </div>
     </Popup >
 
   );
 };
 
 
 ReactDOM.render(<PopupContent />, node);
};
