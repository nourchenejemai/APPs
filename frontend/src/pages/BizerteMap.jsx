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

import SearchControl from "../pages/SearchControl.jsx";


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
    <div className="w-full h-full relative ">
      {/* Layer Checkbox Panel */}
      <div className="absolute top-4 right-4 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm shadow-xl p-4 rounded-lg w-auto max-w-xs text-sm">
        <h2 className="font-bold text-gray-800 text-lg mb-3">Select Map Layers</h2>
      <div className="grid grid-cols-1 gap-2">
  
          {[
            { label: "Gouvernorat", key: "Gouvernorat" },

            { label: "Forages", key: "Forages" },
            { label: "Barrages", key: "Barrages" },
            { label: "Nappe Phreatique", key: "NappePh" },
            { label: "Nappe Profonde", key: "NappePro" },
            
            { label: "Climat", key: "Climat" },
            { label: "Delegation", key: "Delegation" },
            { label: "Geologie", key: "Geologie" },
            { label: "CnBZ", key: "CnBZ" },

            { label: "Pedologie", key: "Pedologie" },
            { label: "Vertisol", key: "Vertisol" },
            { label: "ReseauHyl", key: "ReseauHyl" },




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

     <div className="w-full h-full relative">
          <MapContainer
            center={[34.0, 9.0]} // Center Tunisia
            zoom={6}             // Show entire country
            minZoom={5}
            maxZoom={14}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100%" }}
            maxBounds={[
              [30.0, 6.0], // Southwest Tunisia
              [38.0, 12.0] // Northeast Tunisia
            ]}
            maxBoundsViscosity={0.5} // Allow slight panning out of bounds
          >
            <ResizeFixer />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SearchControl 
              features={allFeatures} 
              onFlyTo={(coords) => map.flyTo(coords, 12)} 
            />
          

                 

          {/* Layers */}
          {selectedLayers.Gouvernorat && <GouvernoratBizerteMap />}

          {selectedLayers.Forages && <ForagesMap  />}
          {selectedLayers.Barrages && <BarragesMap />}
          {selectedLayers.NappePh && <NappePhMap />}
          {selectedLayers.NappePro && <NappeProMap />}
          {selectedLayers.Pedologie && <PedologieMap />}
         
          {selectedLayers.Delegation && <DelegationMap />}
          {selectedLayers.Geologie && <GeologieMap />}
          {selectedLayers.CnBZ && <CNBZMap />}
          
           {selectedLayers.Vertisol && <VertisolMap />}
          {selectedLayers.Climat && <ClimatMap onData={handleLayerData} />}
          {selectedLayers.ReseauHyl && <ReseauMap />}




        </MapContainer>
      </div>
    </div>
  );
};

export default BizerteMap;
