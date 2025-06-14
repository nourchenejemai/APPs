import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import ForagesMap from "../pages/forages/EmplacForages";
import BarragesMap from "../pages/barrages/EmplacBarrages";
import NappePhMap from "../pages/nappePhreatique/EmplacNappaph";
import NappeProMap from "../pages/nappeProfond/EmplacNappeP";
import PedologieMap from "../pages/pedologie/EmplacPedologie";
import VertisolMap from "../pages/vertisol/EmplacVertisol";
import ClimatMap from "../pages/climat/EmplacClimat";
import "leaflet/dist/leaflet.css";

const ResizeFixer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      console.log("Forcing resize...");
      map.invalidateSize(); // ✅ Correct usage
    }, 1500);
  }, [map]);
  return null;
};

const BizerteMap = () => {
  const [selectedLayers, setSelectedLayers] = useState({
    Forages: false,
    Barrages: false,
    NappePh: false,
    NappePro: false,
    Pedologie: false,
    Vertisol: false,
    Climat: false,
  });

  const toggleLayer = (layerName) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  return (
    <div className="w-full h-full relative border-4 border-red-500">
      {/* Layer Checkbox Panel */}
      <div className="absolute top-4 right-4 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm shadow-xl p-4 rounded-lg w-auto max-w-xs text-sm">
        <h2 className="font-bold text-gray-800 text-lg mb-3">Select Map Layers</h2>
<div className="grid grid-cols-1 gap-2">
  
          {[
            { label: "Forages", key: "Forages" },
            { label: "Barrages", key: "Barrages" },
            { label: "Nappe Phreatique", key: "NappePh" },
            { label: "Nappe Profonde", key: "NappePro" },
            { label: "Pedologie", key: "Pedologie" },
            { label: "Vertisol", key: "Vertisol" },
            { label: "Climat", key: "Climat" },
          ].map(({ label, key }) => (
            <label key={key} className="text-sm">
              <input
                type="checkbox"
                checked={selectedLayers[key]}
                onChange={() => toggleLayer(key)}
                className="mr-2"
              />
              <span className="text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full relative">
        <MapContainer
          center={[37.2744, 9.8627]}
          zoom={10}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <ResizeFixer />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Layers */}
          {selectedLayers.Forages && <ForagesMap />}
          {selectedLayers.Barrages && <BarragesMap />}
          {selectedLayers.NappePh && <NappePhMap />}
          {selectedLayers.NappePro && <NappeProMap />}
          {selectedLayers.Pedologie && <PedologieMap />}
          {selectedLayers.Vertisol && <VertisolMap />}
          {selectedLayers.Climat && <ClimatMap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default BizerteMap;
