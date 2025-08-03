import React, { useEffect, useState, useRef } from "react";
import { useMap, GeoJSON,WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";


function NappeProMap() {
  const [nappeP, setNappeP] = useState(null);
  const geoJsonRef = useRef(null);
  const map = useMap();
  const navigate = useNavigate();
  const featureCount = useRef(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/nappePro")
      .then(res => res.json())
      .then(json => {
        if (json?.features?.length) {
          setNappeP(json);
        }
      })
      .catch(error => {
        console.error("Error fetching nappe Profonde data:", error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this nappe Profonde?")) {
      fetch(`http://localhost:8080/api/nappesp/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setNappeP(prev => ({
              ...prev,
              features: prev.features.filter(f => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete nappe Profonde");
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
         <WMSTileLayer
             url="http://localhost:8081/geoserver/bizerte/wms"
            layers="bizerte:NappeProfonde"
            styles="Nappe_profonde2_SLD"
            format="image/png"
            transparent={true}
            version="1.1.1"
             />
    
        {nappeP && (
  
    <GeoJSON
      ref={(layer) => {
        if (layer) geoJsonRef.current = layer;
      }}
      data={nappeP}
      style={{opacity: 0, fillOpacity: 0}}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        const container = document.createElement("div");
        container.innerHTML = `
          <strong>${props.nprnom}</strong><br />
          <b>Surface:</b> ${props.surface}<br />
          <b>Perimetre:</b> ${props.perimetre}<br />
          <b>IDE:</b> ${props.npride}<br />
          <b>Code:</b> ${props.nprcod}<br />
          <b>Réservoir:</b> ${props.nprres}<br />
          <b>Exploitation:</b> ${props.nprexp}<br />
          <b>Qmin:</b> ${props.nprqmi}<br />
          <b>Qmax:</b> ${props.nprqma}<br />
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
        if (featureCount.current === nappeP.features.length) {
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

export default NappeProMap;
