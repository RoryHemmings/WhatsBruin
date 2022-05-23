import { Map, Marker } from "pigeon-maps"

export default function LocationMap() {
  return (
    <Map height={500} defaultCenter={[34.069, -118.44]} width={800} defaultZoom={18}>
      <Marker width={50} anchor={[34.069, -118.44]} />
    </Map>
  )
}