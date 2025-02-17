import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import Rating from "@mui/material/Rating"; 
import L from "leaflet";
import useStyles from "./styles";
import "leaflet/dist/leaflet.css";

// Import default Leaflet marker images
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Fix missing marker by explicitly setting default Leaflet icon
const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Function to create a custom icon with restaurant name
const createCustomIcon = (name) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: white; 
        padding: 4px 8px; 
        border-radius: 4px; 
        box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        white-space: nowrap;
      ">
        ${name}
      </div>
      <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" style="display:block; margin: auto;">
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

// Component to handle map events

  const MapEvents = ({ setCoordinates, setBounds }) => {
  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const center = map.getCenter();
      const bounds = map.getBounds();
      const newBounds = {
        ne: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
        sw: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng }
      };

      setCoordinates({ lat: center.lat, lng: center.lng });

      // ✅ Only update bounds if they actually changed
      setBounds((prevBounds) => {
        if (
          prevBounds.ne?.lat !== newBounds.ne.lat ||
          prevBounds.ne?.lng !== newBounds.ne.lng ||
          prevBounds.sw?.lat !== newBounds.sw.lat ||
          prevBounds.sw?.lng !== newBounds.sw.lng
        ) {
          console.log("Updated Bounds:", newBounds);
          return newBounds;
        }
        return prevBounds; // No change, do nothing
      });
    },
  });

  return null;
};


// Component to re-center the map when coordinates change
const ChangeView = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    console.log("Updating Map Center:", coordinates);
    map.setView([coordinates.lat, coordinates.lng], map.getZoom(), { animate: true });
  }, [coordinates, map]);

  return null;
};

// Main Map Component
const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClicked }) => {
  const classes = useStyles();


  // ✅ Debugging: Log places data
  console.log("Places Data:", places);

  return (
    <div className={classes.mapContainer}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        style={{ height: "90vh", width: "100%", marginLeft: "0" }}
      >
        <ChangeView coordinates={coordinates} />
        <MapEvents setCoordinates={setCoordinates} setBounds={setBounds} />

        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Restaurant Markers */}
        {places
          ?.filter((place) => place.latitude && place.longitude && !isNaN(place.latitude) && !isNaN(place.longitude))
          .map((place) => {
            const lat = Number(place.latitude);
            const lng = Number(place.longitude);

            console.log("Adding Marker:", place.name, lat, lng);

            return (
              <Marker
                key={place.location_id}
                position={[lat, lng]}
                icon={createCustomIcon(place.name)}
                eventHandlers={{ click: () => setChildClicked(place.location_id) }}
              >

                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  <img 
                    src={place.photo ? place.photo.images.large.url : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"}
                    alt={place.name}
                    width="150"
                    height="100"
                    style={{ borderRadius: "5px" }}
                  />
                  <br />
                  <Rating size="small" value={Number(place.rating)} readOnly />
                </Popup>
              </Marker>
            );
          })}

        {/* Current Location Marker */}
        <Marker position={[coordinates.lat, coordinates.lng]} icon={defaultIcon}>
          <Popup>📍 You are here!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
