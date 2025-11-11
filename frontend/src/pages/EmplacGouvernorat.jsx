import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap, WMSTileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function GouvernoratMap() {
  const [gouvData, setGouvData] = useState(null);
  const geoJsonRef = useRef(null);
  const featureCount = useRef(0);
  const map = useMap();

  useEffect(() => {
    fetch("http://localhost:8080/api/gouvernorat")
      .then((res) => res.json())
      .then((json) => {
        if (json?.features?.length) {
          setGouvData(json);
        }
      })
      .catch((err) => console.error("Error fetching gouvernorat data:", err));
  }, []);

  return (
    <>
      {/* ✅ Utilisation correcte de WMSTileLayer avec style SLD */}
      <WMSTileLayer
        url="http://localhost:8081/geoserver/bizerte/wms"
        layers="bizerte:gouvernorat"
        styles="Gouvernorat_Bizerte_SLD"
        format="image/png"
        transparent={true}
        version="1.1.1"
      />

      {/* ✅ Si tu veux conserver les interactions popup via GeoJSON */}
      {gouvData && (
        <GeoJSON
          ref={(layer) => {
            if (layer) geoJsonRef.current = layer;
          }}
          data={gouvData}
          style={{ opacity: 0, fillOpacity: 0}}
          onEachFeature={(feature, layer) => {
            const props = feature.properties;
            const content = `
              <strong>Gouvernorat</strong><br />
              <b>Nom:</b> ${props.Nom_gouver || "Bizerte"}<br />
            `;
            layer.bindPopup(content);

            featureCount.current += 1;
            if (featureCount.current === gouvData.features.length) {
              setTimeout(() => {
                if (geoJsonRef.current) {
                  const bounds = geoJsonRef.current.getBounds();
                  if (bounds.isValid()) {
                    map.fitBounds(bounds, {
                      paddingTopLeft: [60, 140],
                      paddingBottomRight: [50, 30],
                    });
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

export default GouvernoratMap;
