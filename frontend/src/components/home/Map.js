import { Map } from "pigeon-maps";
import { useState } from "react";

export default function LocationMap() {
  const northCampus = [34.0736, -118.4425];
  const southCampus = [34.0686, -118.4425];
  const hill = [34.071224, -118.4518];
  const westwood = [34.0612, -118.444];
  const la = [34.0596, -118.2846];
  const [selected, setSelected] = useState(hill);
  const [zoom, setZoom] = useState(17);
  return (
    <div>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", margin:10}}>
        <button className="map-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(hill); setZoom(17) }}>the hill</button>
        <button className="map-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(northCampus); setZoom(17) }}>north campus</button>
        <button className="map-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(southCampus); setZoom(17) }}>south campus</button>
        <button className="map-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(westwood); setZoom(17) }}>westwood</button>
        <button className="map-button" style={{paddingLeft: 20, paddingRight: 20}} onClick={() => { setSelected(la); setZoom(12) }}>los angeles</button>
      </div>
      <Map height={600} center={selected} zoom={zoom} />
    </div>

  )
}