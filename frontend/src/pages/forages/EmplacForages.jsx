import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap, WMSTileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
import L from 'leaflet';

// Import leaflet images directly
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Delete icon cache to prevent default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

function ForagesMap() {
  const [forages, setForages] = useState(null);
  const geoJsonRef = useRef(null);
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/drilling")
      .then((res) => res.json())
      .then((json) => {
        if (json?.features?.length) {
          setForages(json);
          console.log("Forages data loaded:", json.features.length, "features");
        }
      })
      .catch((err) => console.error("Error fetching forages data:", err));
  }, []);

  const handleDelete = (gid) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce forage ?")) {
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
            alert("Échec de suppression du forage");
          }
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const handleEdit = (forage) => {
    navigate("/ModifyForages", { state: { forage } });
  };

  // Style function
  const getForageStyle = (feature) => {
    const props = feature.properties;
    let color = "#3388ff";
    const depth = props.nirh || props.profondeur || 0;
    
    if (depth > 200) color = "#e74c3c";
    else if (depth > 100) color = "#f39c12";
    else if (depth > 50) color = "#f1c40f";
    else color = "#2ecc71";

    return {
      color: color,
      weight: 3,
      opacity: 0.9,
      fillColor: color,
      fillOpacity: 0.8,
      radius: 12,
    };
  };

  // Simplified pointToLayer - use single circleMarker
  const pointToLayer = (feature, latlng) => {
    const style = getForageStyle(feature);
    
    return L.circleMarker(latlng, {
      radius: style.radius,
      fillColor: style.fillColor,
      color: style.color,
      weight: style.weight,
      opacity: style.opacity,
      fillOpacity: style.fillOpacity,
      interactive: true,
    });
  };

  // Create popup content
  const createPopupContent = (props) => {
    return `
      <div style="padding: 12px; min-width: 250px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 12px 0; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 8px;">
          ${props.nom || "Forage Sans Nom"}
        </h3>
        
        <div style="display: grid; gap: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">ID:</span>
            <span>${props.gid || "N/A"}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">Profondeur:</span>
            <span style="color: #e74c3c; font-weight: bold;">${props.nirh || props.profondeur || "N/A"} m</span>
          </div>
          
          ${props.commune ? `
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">Commune:</span>
            <span>${props.commune}</span>
          </div>
          ` : ''}
          
          ${props.debit ? `
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">Débit:</span>
            <span>${props.debit} m³/h</span>
          </div>
          ` : ''}
        </div>
        
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #ecf0f1; display: flex; gap: 8px; justify-content: center;">
          <button 
            class="popup-btn edit-btn"
            data-action="edit"
            data-gid="${props.gid}"
          >
            ✏️ Modifier
          </button>
          <button 
            class="popup-btn delete-btn"
            data-action="delete" 
            data-gid="${props.gid}"
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    `;
  };

  // Handle feature interactions
  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    
    console.log("Processing feature:", props.gid, props.nom);

    // Bind popup
    layer.bindPopup(createPopupContent(props), {
      closeButton: true,
      autoClose: false,
      closeOnEscapeKey: true,
      className: 'forage-popup',
      maxWidth: 300
    });

    // Click event to open popup
    layer.on('click', function (e) {
      console.log("Feature clicked:", props.nom);
      layer.openPopup(e.latlng);
    });

    // Enhanced hover effects
    layer.on('mouseover', function () {
      layer.setStyle({
        weight: 4,
        opacity: 1,
        fillOpacity: 0.9,
        radius: 14
      });
      map.getContainer().style.cursor = 'pointer';
    });

    layer.on('mouseout', function () {
      const style = getForageStyle(feature);
      layer.setStyle(style);
      map.getContainer().style.cursor = '';
    });

    // Handle popup events
    layer.on('popupopen', () => {
      console.log("Popup opened for:", props.nom);
      
      const popup = layer.getPopup();
      const popupElement = popup.getElement();
      
      // Add event listeners to buttons
      const editBtn = popupElement.querySelector('[data-action="edit"]');
      const deleteBtn = popupElement.querySelector('[data-action="delete"]');
      
      if (editBtn) {
        editBtn.onclick = (e) => {
          e.stopPropagation();
          handleEdit(props);
          layer.closePopup();
        };
      }
      
      if (deleteBtn) {
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (window.confirm("Voulez-vous vraiment supprimer ce forage ?")) {
            handleDelete(props.gid);
            layer.closePopup();
          }
        };
      }
    });
  };

  // Fit bounds when data loads
  useEffect(() => {
    if (forages && geoJsonRef.current) {
      const bounds = geoJsonRef.current.getBounds();
      if (bounds && bounds.isValid()) {
        console.log("Fitting bounds to features");
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [forages, map]);

  // Add CSS for popup buttons
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .popup-btn {
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.3s;
      }
      .edit-btn {
        background: #3498db;
        color: white;
      }
      .edit-btn:hover {
        background: #2980b9;
      }
      .delete-btn {
        background: #e74c3c;
        color: white;
      }
      .delete-btn:hover {
        background: #c0392b;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* WMS background */}
      <WMSTileLayer
        url="http://localhost:8081/geoserver/bizerte/wms"
        layers="bizerte:forages"
        styles="forage_sld"
        format="image/png"
        transparent={true}
        version="1.1.1"
      />

      {forages && (
        <GeoJSON
          key={JSON.stringify(forages)}
          ref={geoJsonRef}
          data={forages}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
          interactive={true}
          bubblingMouseEvents={true}
        />
      )}
    </>
  );
}

export default ForagesMap;