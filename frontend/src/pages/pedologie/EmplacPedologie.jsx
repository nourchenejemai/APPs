import React, { useEffect, useState, useRef } from "react";
import { useMap, GeoJSON, WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";


function PedologieMap() {
  const [ped, setPed] = useState(null);
  const geoJsonRef = useRef(null);
  const map = useMap();
  const navigate = useNavigate();
  const featureCount = useRef(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/pedologiePoint")
      .then(res => res.json())
      .then(json => {
        if (json?.features?.length) {
          setPed(json);
        }
      })
      .catch(error => {
        console.error("Error fetching pedologie data:", error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pedologie?")) {
      fetch(`http://localhost:8080/api/pedologie/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setPed(prev => ({
              ...prev,
              features: prev.features.filter(f => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete pedologie");
          }
        })
        .catch(err => {
          console.error("Delete error:", err);
        });
    }
  };

  const handleEdit = (ped) => {
    navigate("/ModifyPed", { state: { ped } });
  };

  return  (
     <>
          {/* ✅ Utilisation correcte de WMSTileLayer avec style SLD */}
          <WMSTileLayer
            url="http://localhost:8081/geoserver/bizerte/wms"
            layers="bizerte:PEDOLOGIE"
            styles="Pedolodie_SLD"
            format="image/png"
            transparent={true}
            version="1.1.1"
          />
          {ped && (
          <GeoJSON
            ref={(layer) => {
              if (layer) geoJsonRef.current = layer;
            }}
            data={ped}
            style={{opacity: 0, fillOpacity: 0}}
            onEachFeature={(feature, layer) => {
              const props = feature.properties;

              const container = document.createElement("div");
              container.innerHTML = `
                <strong>${props.nprnom}</strong><br />
                <b>Surface:</b> ${props.surface}<br />
                <b>Perimetre:</b> ${props.perimetre}<br />

                <b>Perimetre:</b> ${props.couleur}<br />
                <b>IDE:</b> ${props.rocheme}<br />
                <b>Code:</b> ${props.texture}<br />
                <b>Réservoir:</b> ${props.salure}<br />
                <b>Exploitation:</b> ${props.acteau}<br />
                <b>Qmin:</b> ${props.chargca}<br />
                <b>Qmax:</b> ${props.profond}<br />
                <button id="edit-${props.id}" style="background:#3498db;color:white;margin-right:5px">Edit</button>
                <button id="delete-${props.id}" style="background:#e74c3c;color:white">Delete</button>
              `;

              layer.bindPopup(container);

              layer.on("popupopen", () => {
                document
                  .getElementById(`edit-${props.id}`)
                  .addEventListener("click", () => handleEdit(props));
                document
                  .getElementById(`delete-${props.id}`)
                  .addEventListener("click", () => handleDelete(props.id));
              });

              // Compter combien de features sont ajoutées
              featureCount.current += 1;

              // Une fois toutes les features ajoutées, on centre la carte
              if (featureCount.current === ped.features.length) {
                setTimeout(() => {
                  if (geoJsonRef.current) {
                    const bounds = geoJsonRef.current.getBounds();
                    if (bounds.isValid()) {
                      map.fitBounds(bounds, { padding: [50, 50] });
                    } else {
                      console.warn("Bounds are still not valid.");
                    }
                  }
                }, 100);
              }
            }}
          />
        ) 
      }
      </>
)}
export default PedologieMap;