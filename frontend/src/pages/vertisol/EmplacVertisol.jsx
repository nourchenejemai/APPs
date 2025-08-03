import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap, WMSTileLayer  } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";


function VertisolMap() {
  const [vertisols, setVertisols] = useState(null);
  const geoJsonRef = useRef(null);
  const featureCount = useRef(0);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/vertisolPoint")
      .then((res) => res.json())
      .then((json) => {
        if (json?.features?.length) {
          setVertisols(json);
        }
      })
      .catch((err) => console.error("Error fetching Vertisol data:", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Vertisol?")) {
      fetch(`http://localhost:8080/api/vertisols/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setVertisols((prev) => ({
              ...prev,
              features: prev.features.filter((f) => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete Vertisol");
          }
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const handleEdit = (vert) => {
    navigate("/ModifyVertisol", { state: { vert } });
  };

  return (
    <>
    <WMSTileLayer
      url="http://localhost:8081/geoserver/bizerte/wms"
      layers="bizerte:Vertisols_BZ"
      styles="vertsol_LD"
      format="image/png"
      transparent={true}
      version="1.1.1"
    />
        

  
  {vertisols && (
    <GeoJSON
      ref={(layer) => {
        if (layer) geoJsonRef.current = layer;
      }}
      data={vertisols}
      style={{opacity: 0, fillOpacity: 0}}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        const container = document.createElement("div");
        container.innerHTML = `
          <strong>Vertisol</strong><br />
          <b>Couleur:</b> ${props.couleur}<br />
          <b>Type couleur:</b> ${props.typecoul}<br /><br />
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

        featureCount.current += 1;
        if (featureCount.current === vertisols.features.length) {
          setTimeout(() => {
            if (geoJsonRef.current) {
              const bounds = geoJsonRef.current.getBounds();
              if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
              } else {
                console.warn("Bounds are not valid.");
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

export default VertisolMap;
