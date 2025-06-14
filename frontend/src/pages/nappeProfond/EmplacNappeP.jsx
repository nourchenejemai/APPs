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

function NappeProMap() {
  const [nappeP, setNappeP] = useState([]);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/nappePro")
      .then(res => res.json())
      .then(data => {
        if (data?.features) {
          setNappeP(data.features);

          // Fly to the first nappe's center
          const first = data.features[0];
          if (first?.geometry?.coordinates) {
            const center = getPolygonCenter(first.geometry.coordinates);
            map.flyTo(center, 10); 
          }
        }
      })
      .catch(error => {
        console.error("Error fetching nappe Profond data:", error);
      });
  }, [map]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this nappe Profond?")) {
      fetch(`http://localhost:8080/api/nappesp/${id}`, {
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
     const handleEdit = (nappe) => {
      navigate("/ModifyNappep", { state: { nappe } });
    };

  return (
    <>
      {nappeP.map((feature, index) => {
        const geometry = feature.geometry;
        const props = feature.properties;

        if (geometry?.type === "MultiPolygon") {
          const center = getPolygonCenter(geometry.coordinates);

          return (
            <React.Fragment key={index}>
              
              {/* Marqueur au centre */}
              <Marker position={center} icon={nappeIcon}>
                <Popup>
                  <strong>{props.nprnom}</strong><br />
                  <b>Surface:</b> {props.surface}<br />
                  <b>Perimetre:</b> {props.perimetre}<br />
                  <b>IDE:</b> {props.npride}<br />
                  <b>Code:</b> {props.nprcod}<br />
                  <b>Réservoir:</b> {props.nprres}<br />
                  <b>Exploitation:</b> {props.nprexp}<br />
                  <b>Qmin:</b> {props.nprqmi}<br />
                  <b>Qmax:</b> {props.nprqma}<br />
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

export default NappeProMap;
