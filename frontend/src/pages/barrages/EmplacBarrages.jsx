import React, { useEffect, useState } from "react";
import { Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate  } from "react-router-dom";

const greenIcon = new L.Icon({
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

function BarragesMap() {
  const [dams, setDams] = useState([]);
  const map = useMap(); // Access Leaflet map instance
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/dams/dams")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.features) {
          setDams(data.features);
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
            setDams((prev) => prev.filter((f) => f.properties.gid !== gid));
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
      navigate("/ModifyBarrage", { state: { barrage: {
    ...dam.properties,
    geom: dam.geom
  }}})
    };
  return (
    <>
      {dams.map((feature, index) => {
        const geometry = feature.geom;
        const props = feature.properties;
        let position = null;

        if (geometry?.type === "Point") {
          position = [geometry.coordinates[1], geometry.coordinates[0]];
        } else if (geometry?.type === "MultiPolygon") {
          position = getPolygonCenter(geometry.coordinates);
        }

        return position ? (
          <React.Fragment key={index}>
            <Marker position={position} icon={greenIcon}>
              <Popup>
                <strong>{props.name}</strong><br />
                Type: {props.type_bge}<br />
                Code: {props.code}<br />
                Description: {props.disc}
                <br /><br />
                <button
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}
                        onClick={() => handleDelete(props.id)}
                      >
                        Delete
                      </button>
                      <button
                        style={{ backgroundColor: 'blue', color: 'white' }}
                        onClick={() => handleEdit(feature)}
                      >
                        Edit
                      </button>
              </Popup>
            </Marker>
           
          </React.Fragment>
        ) : null;
      })}
    </>
  );
}

export default BarragesMap;
