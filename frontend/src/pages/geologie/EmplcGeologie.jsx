import React, { useEffect, useState, useRef, useContext } from "react";
import { useMap, GeoJSON,WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppContext';


function GeologieMap() {
  const [geologData, setGeologData] = useState(null);
  const geoJsonRef = useRef(null);
  const featureCount = useRef(0);
  const map = useMap();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  

  useEffect(() => {
    fetch("http://localhost:8080/api/geologiebz")
      .then(res => res.json())
      .then(json => {
        if (json?.features?.length) {
          const fixed = {
            ...json,
            features: json.features.map(f => ({
              ...f,
              geometry: f.geometry || f.geom, // corrige clé si besoin
            })),
          };

          setGeologData(fixed);
        }
      })
      .catch(err => console.error("Error fetching Geologie data:", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Geologie?")) {
      fetch(`http://localhost:8080/api/geologie/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setGeologData(prev => ({
              ...prev,
              features: prev.features.filter(f => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete Geologie");
          }
        })
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (geo) => {
    navigate("/ModifyGeologie", { state: { geo } });
  };

  return  (
      <>
        <WMSTileLayer
          url="http://localhost:8081/geoserver/bizerte/wms"
          layers="bizerte:geologie_bizerte"
          styles="geologie_SLD"
          format="image/png"
          transparent={true}
          version="1.1.1"
        />
      {geologData && (
    <GeoJSON
      ref={(layer) => {
        if (layer) geoJsonRef.current = layer;
      }}
      data={geologData}
      style={{opacity: 0, fillOpacity: 0}}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        const container = document.createElement("div");
        container.innerHTML = `
          <b>Superficie:</b> ${props.superficie}<br />
          <b>Âge:</b> ${props.age}<br />
          <b>Code:</b> ${props.code}<br />
          <b>Description:</b> ${props.descript}<br /><br />
          ${userData ? `
          <button id="edit-${props.id}" style="background:#3498db;color:white;margin-right:5px">Edit</button>
          <button id="delete-${props.id}" style="background:#e74c3c;color:white">Delete</button>
          ` : '' }
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

        // Zoom automatique une seule fois après le rendu
        featureCount.current += 1;
        if (featureCount.current === geologData.features.length) {
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
)
      }

export default GeologieMap;
