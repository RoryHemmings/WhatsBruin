import { Map } from "pigeon-maps";
import { useState } from "react";

export default function LocationMap() {
  const northCampus = [34.0736, -118.4425];
  const southCampus = [34.0686, -118.4425];
  const hill = [34.071224, -118.4518];
  const westwood = [34.0612, -118.444];
  const [selected, setSelected] = useState(hill);
  return (
    <div style={{paddingBottom:20}}>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", margin:10, paddingBottom:10}}>
        <button className="popup-remove-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(hill) }}>the hill</button>
        <button className="popup-remove-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(northCampus) }}>north campus</button>
        <button className="popup-remove-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(southCampus) }}>south campus</button>
        <button className="popup-remove-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(westwood) }}>westwood</button>
      </div>
      <Map height={600} width={1300} center={selected} zoom={17}/>
    </div>

  )
}