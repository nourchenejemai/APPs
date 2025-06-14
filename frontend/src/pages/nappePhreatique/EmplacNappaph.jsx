import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Icône personnalisée
const nappeIcon = new L.Icon({
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

function NappePhMap() {
  const [nappeph, setNappePh] = useState([]);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/nappePh")
      .then(res => res.json())
      .then(data => {
        if (data?.features) {
          setNappePh(data.features);

          // Fly to the first nappe's center
          const first = data.features[0];
          if (first?.geometry?.coordinates) {
            const center = getPolygonCenter(first.geometry.coordinates);
            map.flyTo(center, 10); // Zoom level 10
          }
        }
      })
      .catch(error => {
        console.error("Error fetching nappe Phreatique data:", error);
      });
  }, [map]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this nappe Phreatique?")) {
      fetch(`http://localhost:8080/api/nappes/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setNappePh(prev => prev.filter(f => f.properties.id !== id));
          } else {
            alert("Failed to delete nappe Phreatique");
          }
        })
        .catch(err => {
          console.error("Delete error:", err);
        });
    }
  };
     const handleEdit = (nappe) => {
      navigate("/ModifyNappeph", { state: { nappe } });
    };

  return (
    <>
      {nappeph.map((feature, index) => {
        const geometry = feature.geometry;
        const props = feature.properties;

        if (geometry?.type === "MultiPolygon") {
          const center = getPolygonCenter(geometry.coordinates);

          return (
            <React.Fragment key={index}>
              
              {/* Marqueur au centre */}
              <Marker position={center} icon={nappeIcon}>
                <Popup>
                  <strong>{props.nphnom}</strong><br />
                  <b>Surface:</b> {props.surface}<br />
                  <b>Perimetre:</b> {props.perimetre}<br />
                  <b>IDE:</b> {props.nphide}<br />
                  <b>Code:</b> {props.nphcod}<br />
                  <b>Réservoir:</b> {props.nphres}<br />
                  <b>Exploitation:</b> {props.nphexp}<br />
                  <b>Qmin:</b> {props.nphqmi}<br />
                  <b>Qmax:</b> {props.nphqma}<br />
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

export default NappePhMap;
