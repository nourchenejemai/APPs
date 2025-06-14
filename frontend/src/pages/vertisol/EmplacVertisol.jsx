import React, { useEffect, useState } from "react";
import { Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate  } from "react-router-dom";

const Icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
});

function getPolygonCenter(coords) {
  const flat = coords.flat(2); // Flatten nested arrays to get all points
  const lats = flat.map((p) => p[1]);
  const lngs = flat.map((p) => p[0]);
  const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  return [lat, lng];
}

function VertisolMap() {
  const [Vert, setVert] = useState([]);
  const map = useMap(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/vertisolPoint")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.features) {
          setVert(data.features);
        }
      })
      .catch((err) => console.error("Error fetching vertisol:", err));
  }, []);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Vertisol?")) {
      fetch(`http://localhost:8080/api/vertisols/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setVert((prev) => prev.filter((f) => f.properties.id !== id));
          } else {
            alert("Failed to delete Vertisol");
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
        });
    }
  };

 const handleEdit = (vert) => {
      navigate("/ModifyVertisol", { state: { vert } });
    };
  return (
    <>
         {Vert.map((feature, index) => {
           const geometry = feature.geometry;
           const props = feature.properties;
   
           if (geometry?.type === "MultiPolygon") {
             const center = getPolygonCenter(geometry.coordinates);
   
             return (
               <React.Fragment key={index}>
                 
                 {/* Marqueur au centre */}
                 <Marker position={center} icon={Icon}>
                   <Popup>
                     Couleur : {props.couleur}<br />
                    TypeC : {props.typecoul}<br />

                    
   
                    <button
                           style={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}
                           onClick={() => handleDelete(props.id)}
                         >
                           Delete
                         </button>
                         <button
                           style={{ backgroundColor: 'blue', color: 'white' }}
                           onClick={() => handleEdit(props)}
                         >
                           Edit
                         </button>
                   </Popup>
                 </Marker>
               </React.Fragment>
             );
           }
   
           return null;
         })}
       </>
  );
}

export default VertisolMap;
