import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Icône personnalisée
const Icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
});

// Calcule le centre d'une MultiPolygon (approximation)
function getPolygonCenter(coords) {
  const flat = coords.flat(2); // Aplati les coordonnées
  const lats = flat.map(p => p[1]);
  const lngs = flat.map(p => p[0]);
  const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  return [lat, lng];
}

function ClimatMap() {
  const [Climat, setClimat] = useState([]);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/climatbz")
      .then(res => res.json())
      .then(data => {
        if (data?.features) {
          setClimat(data.features);

          // Fly to the first nappe's center
          const first = data.features[0];
          if (first?.geometry?.coordinates) {
            const center = getPolygonCenter(first.geometry.coordinates);
            map.flyTo(center, 10); // Zoom level 10
          }
        }
      })
      .catch(error => {
        console.error("Error fetching Climat data:", error);
      });
  }, [map]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Climat?")) {
      fetch(`http://localhost:8080/api/climat/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setNappeP(prev => prev.filter(f => f.properties.id !== id));
          } else {
            alert("Failed to delete nappe Profond");
          }
        })
        .catch(err => {
          console.error("Delete error:", err);
        });
    }
  };
     const handleEdit = (climat) => {
      navigate("/ModifyClimat", { state: { climat } });
    };

  return (
    <>
      {Climat.map((feature, index) => {
        const geometry = feature.geometry;
        const props = feature.properties;

        if (geometry?.type === "MultiPolygon") {
          const center = getPolygonCenter(geometry.coordinates);

          return (
            <React.Fragment key={index}>
              
              {/* Marqueur au centre */}
              <Marker position={center} icon={Icon}>
                <Popup>
                  <strong>{props.clmnom}</strong><br />
                  <b>Surface:</b> {props.surface}<br />
                  <b>Perimetre:</b> {props.perimetre}<br />
                  <b>IDE:</b> {props.clmide}<br />
                  <b>Clmcla:</b> {props.clmcla}<br />
                  <b>Clmmox:</b> {props.clmmox}<br />
                 
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
            </React.Fragment>
          );
        }

        return null;
      })}
    </>
  );
}

export default ClimatMap;
