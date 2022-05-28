import { Map, Marker } from "pigeon-maps"

export default function LocationMap() {
  const campus = [34.072164, -118.4425];
  const hill = [34.071224, -118.4518];
  const westwood = [];
  const LA = [];

  return (
    <Map height={500} defaultCenter={hill} width={900} defaultZoom={18}/>
  )
}