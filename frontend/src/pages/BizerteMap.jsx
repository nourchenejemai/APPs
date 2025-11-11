import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import ForagesMap from "../pages/forages/EmplacForages";
import BarragesMap from "../pages/barrages/EmplacBarrages";
import NappePhMap from "../pages/nappePhreatique/EmplacNappaph";
import NappeProMap from "../pages/nappeProfond/EmplacNappeP";
import PedologieMap from "../pages/pedologie/EmplacPedologie";
import VertisolMap from "../pages/vertisol/EmplacVertisol";
import ClimatMap from "../pages/climat/EmplacClimat";
import DelegationMap from "./delegation/EmplcDelegation";
import GeologieMap from "./geologie/EmplcGeologie";
import CNBZMap from "./cn_bizerte/EmplCN";
import ReseauMap from "../pages/resauxHydr/EmplcReseau"
import GouvernoratBizerteMap from "../pages/EmplacGouvernorat.jsx";

const ResizeFixer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      console.log("Forcing resize...");
      map.invalidateSize(); 
    }, 1500);
  }, [map]);
  return null;
};

const BizerteMap = () => {
  const [allFeatures, setAllFeatures] = useState([]);

  const [selectedLayers, setSelectedLayers] = useState({
    Gouvernorat: false,
    Forages: false,
    Barrages: false,
    NappePh: false,
    NappePro: false,
    Pedologie: false,
    Vertisol: false,
    Climat: false,
    Delegation: false,
    Geologie: false,
    CnBZ:false,
    ReseauHyl: false,
  });

  const toggleLayer = (layerName) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const handleLayerData = (features) => {
    setAllFeatures((prev) => [...prev, ...features]);
  };

  return (
    <div className="w-full h-full relative">
      {/* Layer Checkbox Panel - Z-INDEX RÉDUIT */}
      <div className="absolute top-4 right-4 z-[10] bg-white bg-opacity-90 backdrop-blur-sm shadow-xl p-4 rounded-lg w-auto max-w-xs text-sm">
        <h2 className="font-bold text-gray-800 text-lg mb-3">select map layers</h2>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: "Gouvernorat", key: "Gouvernorat" },
            { label: "Delegation", key: "Delegation" },
            { label: "Climat", key: "Climat" },
            { label: "CnBZ", key: "CnBZ" },
            { label: "Geologie", key: "Geologie" },
            { label: "Pedologie", key: "Pedologie" },
            { label: "Vertisol", key: "Vertisol" },
            { label: "ReseauHydro", key: "ReseauHyd" },
            { label: "Barrages", key: "Barrages" },
            { label: "Forages", key: "Forages" },
            { label: "Nappe Phreatique", key: "NappePh" },
            { label: "Nappe Profonde", key: "NappePro" },
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

      {/* Map Container avec z-index bas */}
      <div className="w-full h-full relative z-0">
        <MapContainer
          center={[34.0, 9.0]}
          zoom={6}
          minZoom={5}
          maxZoom={14}
          scrollWheelZoom={true}
          style={{ height: "100vh", width: "100%" }}
          maxBounds={[
            [30.0, 6.0],
            [38.0, 12.0]
          ]}
          maxBoundsViscosity={0.5}
        >
          <ResizeFixer />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Layers */}
          {selectedLayers.Gouvernorat && <GouvernoratBizerteMap />}
          {selectedLayers.Forages && <ForagesMap />}
          {selectedLayers.Barrages && <BarragesMap />}
          {selectedLayers.NappePh && <NappePhMap />}
          {selectedLayers.NappePro && <NappeProMap />}
          {selectedLayers.Pedologie && <PedologieMap />}
          {selectedLayers.Delegation && <DelegationMap />}
          {selectedLayers.Geologie && <GeologieMap />}
          {selectedLayers.CnBZ && <CNBZMap />}
          {selectedLayers.Vertisol && <VertisolMap />}
          {selectedLayers.Climat && <ClimatMap onData={handleLayerData} />}
          {selectedLayers.ReseauHyd && <ReseauMap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default BizerteMap;