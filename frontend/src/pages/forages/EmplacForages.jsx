import React, { useEffect, useState } from "react";
import { Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

const greenIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
});

function getPolygonCenter(coords) {
  const flat = coords.flat(2);
  const lats = flat.map((p) => p[1]);
  const lngs = flat.map((p) => p[0]);
  return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
}

function ForagesMap({ onDataReady }) {
  const [drillings, setDrillings] = useState([]);
  const map = useMap(); // Access Leaflet map instance
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/drilling")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.features) {
          setDrillings(data.features);

          const first = data.features[0];
          if (first?.geometry?.coordinates) {
            const position = getPolygonCenter(first.geometry.coordinates);
            map.flyTo(position, 10); // Zoom level 10
          }
        }
      })
      .catch((err) => console.error("Error fetching forages:", err));
  }, []);
    

    const handleEdit = (forage) => {
      navigate("/ModifyForages", { state: { forage } });
    };
  return (
    <>
      {drillings.map((feature, index) => {
        const geometry = feature.geom;
        const props = feature.properties;
        let position = null;

        if (geometry?.type === "Point") {
          position = [geometry.coordinates[1], geometry.coordinates[0]];
        } else if (geometry?.type === "MultiPolygon") {
          position = getPolygonCenter(geometry.coordinates);
        }

        return position ? (
          <React.Fragment key={index}>
            <Marker position={position} icon={greenIcon}>
              <Popup>
                <strong>{props.nom}</strong><br />
                Profondeur : {props.profondeur}<br />
                Code Nom : {props.code___nom}
                <br /><br />
                <button
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}
                        onClick={() => handleDelete(props.id)}
                      >
                        Delete
                      </button>
                      <button
                        style={{ backgroundColor: 'blue', color: 'white' }}
                        onClick={() => handleEdit(props)}
                      >
                        Edit
                      </button>
              </Popup>
            </Marker>
            {geometry?.type === "MultiPolygon" && (
              <GeoJSON data={{ type: "Feature", geometry }} />
            )}
          </React.Fragment>
        ) : null;
      })}
    </>
  );
}

export default ForagesMap;
