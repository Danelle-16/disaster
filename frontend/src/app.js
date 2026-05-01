import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event, i) =>
        event.geometry?.map((geo, j) => (
          <Marker key={i + "-" + j} position={[geo.coordinates[1], geo.coordinates[0]]}>
            <Popup>
              <b>{event.title}</b><br />
              {event.categories[0].title}
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
}

export default App;