import React, { useEffect, useState, useRef } from "react";
import { GeoJSON, useMap, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Add this style to fix the error
const gouvernoratStyle = {
  color: "#ff6600",
  fillColor: "#ffcc99",
  weight: 2,
  fillOpacity: 0.5,
};

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
      <TileLayer
        url="http://localhost:8081/geoserver/bizerte/wms"
        params={{
          service: "WMS",
          request: "GetMap",
          version: "1.1.0",
          layers: "bizerte:gouvernorat",
          styles: "Gouvernorat_Bizerte_SLD",
          format: "image/png",
          transparent: true,
        }}
      />

      {gouvData && (
        <GeoJSON
          ref={(layer) => {
            if (layer) geoJsonRef.current = layer;
          }}
          data={gouvData}
          style={() => gouvernoratStyle}
          onEachFeature={(feature, layer) => {
            const props = feature.properties;
            const content = `
              <strong>Gouvernorat</strong><br />
              <b>Nom:</b> ${props.Nom_gouver || "Bizerte"}<br />
              <b>Code:</b> ${props.code_gouve || "17"}
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
