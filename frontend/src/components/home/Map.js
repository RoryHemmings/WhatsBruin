import { Map, Marker } from "pigeon-maps"

export default function LocationMap() {
  const north_campus = [34.072164, -118.4425];
  const south_campus = [34.0689, -118.4422];
  const hill = [34.071224, -118.4518];


  return (
    <Map height={500} defaultCenter={hill} width={800} defaultZoom={18}/>
  )
}