import React, { useEffect, useState, useRef,useContext } from "react";
import { GeoJSON, useMap,WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppContext';


const DelegationMap = () => {
  const [data, setData] = useState(null);
    const { userData } = useContext(AppContext);
  
  const geoJsonRef = useRef(null); //GeoJSON ref
    const featureCount = useRef(0);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/delegationbz")
      .then(res => res.json())
      .then(json => {
        if (json?.features?.length) {
          setData(json);

        
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

  return (
    <>
             <WMSTileLayer
                 url="http://localhost:8081/geoserver/bizerte/wms"
                layers="bizerte:Delegations_Bizerte_UTM"
                styles="delegation_b"
                format="image/png"
                transparent={true}
                version="1.1.1"
                 />
      { data && (
    <GeoJSON
      ref={geoJsonRef}
      data={data}
      style={{opacity: 0, fillOpacity: 0}}
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
         featureCount.current += 1;
            if (featureCount.current === data.features.length) {
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
  ) 
}
</>
  )}

export default DelegationMap;
