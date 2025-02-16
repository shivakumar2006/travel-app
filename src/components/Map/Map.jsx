import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import useStyles from "./styles";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

const Map = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery("(min-width: 600px)");

  // Default map center (latitude, longitude)
  const position = [28.6139, 77.2090]; // Example: New Delhi, India

  return (
    <div className={classes.mapContainer}>
      <MapContainer center={position} zoom={13} style={{ height: "95vh", width: "950px", marginLeft: "0" }}>
        {/* Tile Layer (Background Map) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Example Marker */}
        <Marker position={position} icon={customIcon}>
          <Popup>
            📍 You are here! (New Delhi, India)
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
