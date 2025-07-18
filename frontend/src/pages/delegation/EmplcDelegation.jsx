import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";

const delegationStyle = {
  color: "#1f77b4",
  weight: 2,
  fillColor: "#aec7e8",
  fillOpacity: 0.6,
};

const DelegationMap = () => {
  const [data, setData] = useState(null);
  const geoJsonRef = useRef(null); //GeoJSON ref
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/delegationbz")
      .then(res => res.json())
      .then(json => {
        if (json?.features?.length) {
          setData(json);

          // Delay until GeoJSON is rendered
          setTimeout(() => {
            if (geoJsonRef.current) {
              const bounds = geoJsonRef.current.getBounds();
              map.fitBounds(bounds, { padding: [50, 50] }); //Show all
            }
          }, 300);
        }
      })
      .catch(error => {
        console.error("Error fetching delegation data:", error);
      });
  }, [map]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this delegation?")) {
      fetch(`http://localhost:8080/api/delegation/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setData(prev => ({
              ...prev,
              features: prev.features.filter(f => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete.");
          }
        });
    }
  };

  const handleEdit = (delegation) => {
    navigate("/ModifyDelegation", { state: { del: delegation } });
  };

  return data ? (
    <GeoJSON
      ref={geoJsonRef}
      data={data}
      style={() => delegationStyle}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        const container = document.createElement("div");
        container.innerHTML = `
          <strong>${props.altnamef}</strong><br/>
          <b>Nomgouv:</b> ${props.nomgouv}<br/>
          <b>Codegouv:</b> ${props.codegouv}<br/>
          <b>Reftncod:</b> ${props.reftncod}<br/>
          <b>Shapearea:</b> ${props.shapearea}<br/>
          <b>Shapeleng:</b> ${props.shapeleng}<br/><br/>
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
      }}
    />
  ) : null;
};

export default DelegationMap;
