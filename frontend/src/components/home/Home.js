import Filter from '../filter/Filter';
import LocationMap from './Map';
import PersonalCalendar from './PersonalCalendar';
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";
let user = getWithExpiry("user");
let userInfo;
if(user){
  userInfo = jwt_decode(user);
}
export default function Home(){
  return (
    <div className="App">
      <p style={{color: "#F68C3E", fontSize: 40 , paddingTop:20}}>{userInfo.username}'s Calendar</p>
      <div>
        <PersonalCalendar/>
        <br/>
        <p style={{color: "#F68C3E", fontSize: 40}}>♡ reference map ♡</p>
        <LocationMap />
      </div>
    </div>
  );
}