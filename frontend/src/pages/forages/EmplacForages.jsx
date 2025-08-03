import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap, WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

function ForagesMap() {
  const [drilling, setForages] = useState(null);
  const geoJsonRef = useRef(null);
  const featureCount = useRef(0);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/drilling")
      .then((res) => res.json())
      .then((json) => {
        if (json?.features?.length) {
          setForages(json);
        }
      })
      .catch((err) => console.error("Error fetching forages data:", err));
  }, []);

  const handleDelete = (gid) => {
    if (window.confirm("Are you sure you want to delete this forages?")) {
      fetch(`http://localhost:8080/api/forages/${gid}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setForages((prev) => ({
              ...prev,
              features: prev.features.filter((f) => f.properties.gid !== gid),
            }));
          } else {
            alert("Failed to delete forages");
          }
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const handleEdit = (forage) => {
    navigate("/ModifyForages", { state: { forage } });
  };

  return (
    <>
      {/* Style WMS (avec SLD) */}
      <WMSTileLayer
        url="http://localhost:8081/geoserver/bizerte/wms"
        layers="bizerte:forages"
        styles="forage_sld"
        format="image/png"
        transparent={true}
        version="1.1.1"
      />

      {/* GeoJSON points interactifs */}
      {drilling && (
        <GeoJSON
          ref={(layer) => {
            if (layer) geoJsonRef.current = layer;
          }}
          data={drilling}
          style={{ opacity: 0, fillOpacity: 0 }} // Invisible pour ne pas interférer avec le style WMS
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 8,
              fillColor: "#007BFF",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            });
          }}
          onEachFeature={(feature, layer) => {
            const props = feature.properties;

            const container = document.createElement("div");
            container.innerHTML = `
              <strong>${props.nom || "Sans nom"}</strong><br/>
              <b>Profondeur:</b> ${props.profondeur ?? "N/A"}<br/>
              <b>Code Nom:</b> ${props.code___nom ?? "N/A"}<br/><br/>
              <button id="edit-${props.gid}" style="background:#3498db;color:white;padding:3px 6px;margin-right:5px;border:none;border-radius:4px;">Edit</button>
              <button id="delete-${props.gid}" style="background:#e74c3c;color:white;padding:3px 6px;border:none;border-radius:4px;">Delete</button>
            `;

            layer.bindPopup(container);

            layer.on("popupopen", () => {
              document
                .getElementById(`edit-${props.gid}`)
                .addEventListener("click", () => handleEdit(props));
              document
                .getElementById(`delete-${props.gid}`)
                .addEventListener("click", () => handleDelete(props.gid));
            });

            featureCount.current += 1;
            if (featureCount.current === drilling.features.length) {
              setTimeout(() => {
                if (geoJsonRef.current) {
                  const bounds = geoJsonRef.current.getBounds();
                  if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                  }
                }
              }, 100);
            }
          }}
        />
      )}
    </>
  );
}

export default ForagesMap;
