import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Style vert pour CN
const lineStyle = {
  color: "green",
  weight: 3,
};

function CnBZMap() {
  const [cnBZ, setCnBZ] = useState(null);
  const geoJsonRef = useRef(null);
  const featureCount = useRef(0);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/cnbz")
      .then((res) => res.json())
      .then((json) => {
        if (json?.features?.length) {
          setCnBZ(json);
        }
      })
      .catch((err) => console.error("Error fetching CN:", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this CN?")) {
      fetch(`http://localhost:8080/api/cn/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setCnBZ((prev) => ({
              ...prev,
              features: prev.features.filter((f) => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete CN");
          }
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const handleEdit = (cn) => {
    navigate("/ModifyCN", { state: { cn } });
  };

  return cnBZ ? (
    <GeoJSON
      ref={(layer) => {
        if (layer) geoJsonRef.current = layer;
      }}
      data={cnBZ}
      style={() => lineStyle}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        const container = document.createElement("div");
        container.innerHTML = `
          <strong>${props.object || "CN"}</strong><br />
          <b>Fnode:</b> ${props.fnode}<br />
          <b>Tnode:</b> ${props.tnode}<br />
          <b>Length:</b> ${props.lengthh}<br />
          <b>ID:</b> ${props.id}<br /><br />
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
        if (featureCount.current === cnBZ.features.length) {
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
  ) : null;
}

export default CnBZMap;
