import React, { useEffect, useState, useRef,useContext } from "react";
import { GeoJSON, useMap,WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppContext';

function BarragesMap() {
  const [data, setData] = useState(null);
  const { userData } = useContext(AppContext);
  const geoJsonRef = useRef(null);
  const map = useMap();
  const navigate = useNavigate();
  const featureCount = useRef(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/dams/dams")
      .then((res) => res.json())
      .then(json => {
  if (json?.features?.length) {
    // Convertir "geom" -> "geometry"
    const fixed = {
      ...json,
      features: json.features.map(f => ({
        ...f,
        geometry: f.geom, 
      }))
    };

    setData(fixed);
    console.log("Polygones barrages corrigés:", fixed);
  }
})

      .catch((err) => console.error("Error fetching barrages:", err));
  }, []);

  const handleDelete = (gid) => {
    if (window.confirm("Are you sure you want to delete this dam?")) {
      fetch(`http://localhost:8080/api/barrages/${gid}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setData((prev) => ({
              ...prev,
              features: prev.features.filter(f => f.properties.gid !== gid),
            }));
          } else {
            alert("Failed to delete dam");
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
        });
    }
  };

  const handleEdit = (dam) => {
    navigate("/ModifyBarrage", {
      state: {
        barrage: {
          ...dam.properties,
          geom: dam.geom,
        },
      },
    });
  };

  return (
      <>
              {/* ✅ Utilisation correcte de WMSTileLayer avec style SLD */}
              <WMSTileLayer
                url="http://localhost:8081/geoserver/bizerte/wms"
                layers="bizerte:barrage"
                styles="Barrages_Bizerte_sld"
                format="image/png"
                transparent={true}
                version="1.1.1"
              />
    {data && (
    <GeoJSON
      ref={(layer) => {
        if (layer) geoJsonRef.current = layer;
      }}
      data={data}
      style={{opacity: 0, fillOpacity: 0}}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        const container = document.createElement("div");
        container.innerHTML = `
          <strong>${props.name}</strong><br />
          <b>Type:</b> ${props.type_bge}<br />
          <b>Code:</b> ${props.code}<br />
          <b>Description:</b> ${props.disc}<br /><br />
           ${userData ? `
          <button id="edit-${props.id}" style="background:#3498db;color:white;margin-right:5px">Edit</button>
          <button id="delete-${props.id}" style="background:#e74c3c;color:white">Delete</button>
          ` : '' }
        `;

        layer.bindPopup(container);

        layer.on("popupopen", () => {
          document
            .getElementById(`edit-${props.id}`)
            .addEventListener("click", () => handleEdit(feature));
          document
            .getElementById(`delete-${props.id}`)
            .addEventListener("click", () => handleDelete(props.id));
        });

        // Zoom automatique une seule fois après le rendu complet
        featureCount.current += 1;
        if (featureCount.current === data.features.length) {
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

export default BarragesMap;
