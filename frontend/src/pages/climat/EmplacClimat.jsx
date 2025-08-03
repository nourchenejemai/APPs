import React, { useEffect, useState, useRef } from "react";
import { useMap, GeoJSON, TileLayer,WMSTileLayer  } from "react-leaflet";
import { useNavigate } from "react-router-dom";

function ClimatMap() {
  const [climatData, setClimatData] = useState(null);
  const geoJsonRef = useRef(null);
  const featureCount = useRef(0);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/climatbz")
      .then(res => res.json())
      .then(json => {
        if (json?.features?.length) {
          const fixedGeoJSON = {
            ...json,
            features: json.features.map(f => ({
              ...f,
              geometry: f.geometry || f.geom,
            })),
          };
          setClimatData(fixedGeoJSON);
        }
      })
      .catch(error => {
        console.error("Error fetching Climat data:", error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Climat?")) {
      fetch(`http://localhost:8080/api/climat/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (res.ok) {
            setClimatData(prev => ({
              ...prev,
              features: prev.features.filter(f => f.properties.id !== id),
            }));
          } else {
            alert("Failed to delete Climat");
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
      {/* WMS Layer from GeoServer */}
      <WMSTileLayer
        url="http://localhost:8081/geoserver/bizerte/wms"
        layers= "bizerte:climat_Bizerte"
        styles= "climat_bizerte"
        format= "image/png"
        transparent= {true}
        version="1.1.1"
        
      />

      {/* GeoJSON Layer with interactivity */}
      {climatData && (
        <GeoJSON
          ref={(layer) => {
            if (layer) geoJsonRef.current = layer;
          }}
          data={climatData}
          style={{opacity: 0, fillOpacity: 0}}
          onEachFeature={(feature, layer) => {
            const props = feature.properties;

            const container = document.createElement("div");
            container.innerHTML = `
              <strong>${props.clmnom}</strong><br />
              <b>Surface:</b> ${props.surface}<br />
              <b>Perimetre:</b> ${props.perimetre}<br />
              <b>IDE:</b> ${props.clmide}<br />
              <b>Clmcla:</b> ${props.clmcla}<br />
              <b>Clmmox:</b> ${props.clmmox}<br /><br />
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
            if (featureCount.current === climatData.features.length) {
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

export default ClimatMap;
