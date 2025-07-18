import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const SearchControl = ({ features = [], onFlyTo }) => {
  const map = useMap();

  useEffect(() => {
    // Crée un élément input personnalisé
    const input = L.DomUtil.create("input", "leaflet-search-input");
    input.type = "text";
    input.placeholder = "🔍 Rechercher...";

    // Empêche les événements souris sur la carte lorsqu'on tape
    L.DomEvent.disableClickPropagation(input);

    // Crée un contrôle Leaflet
    const control = L.control({ position: "topleft" });
    control.onAdd = () => {
      const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      container.style.background = "white";
      container.style.padding = "5px";
      container.style.borderRadius = "8px";
      container.appendChild(input);
      return container;
    };
    control.addTo(map);

    // Ajoute un événement pour chercher dans les features
    input.addEventListener("keyup", (e) => {
      const query = e.target.value.toLowerCase();
      const match = features.find((f) => {
        const name =
          f.properties?.name ||
          f.properties?.nom ||
          f.properties?.clmnom ||
          f.properties?.object ||
          "";
        return name.toLowerCase().includes(query);
      });

      if (match && match.geometry) {
        const coords = getFeatureCenter(match.geometry);
        if (coords) onFlyTo(coords);
      }
    });

    return () => {
      map.removeControl(control);
    };
  }, [map, features, onFlyTo]);

  return null;
};

function getFeatureCenter(geometry) {
  const { type, coordinates } = geometry;
  if (type === "Point") {
    return [coordinates[1], coordinates[0]];
  } else if (type === "MultiPolygon") {
    const flat = coordinates.flat(2);
    const lats = flat.map((p) => p[1]);
    const lngs = flat.map((p) => p[0]);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ];
  } else if (type === "LineString") {
    const mid = Math.floor(coordinates.length / 2);
    return [coordinates[mid][1], coordinates[mid][0]];
  }
  return null;
}

export default SearchControl;
