import React, { useState, useEffect } from "react"; 
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { getPlacesData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List"; 
import Map from "./components/Map/Map";

import "./index.css";

const theme = createTheme();

const App = () => {
    const [places, setPlaces] = useState([]);
    const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to New Delhi
    const [bounds, setBounds] = useState({});
    const [ childClicked, setChildClicked ] = useState(null);
    const [ filteredPlaces, setFilteredPlaces ]= useState([]);

    const [ isLoading, setIsLoading ] = useState(false);
    const [ type, setType ] = useState('restaurant');
    const [ rating, setRating ] = useState('0');

    // Track user's live location
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            ({ coords: { latitude, longitude } }) => {
                setCoordinates({ lat: latitude, lng: longitude });
            },
            (error) => console.error("Error fetching location:", error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating)

        setFilteredPlaces(filteredPlaces);
    }, [rating, places]);

    // Fetch places data when coordinates or bounds change
    useEffect(() => {
        const delayFetch = setTimeout(() => {
          if (bounds?.sw && bounds?.ne) {
            console.log("📡 Fetching data for bounds:", bounds);
            
            setIsLoading(true);
            getPlacesData(type, bounds.sw, bounds.ne)
              .then((data) => {
                console.log("📡 API Response:", data);
                setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
                setFilteredPlaces([]);
                setIsLoading(false);
              })
              .catch((error) => {
                console.error("❌ API Fetch Error:", error);
                setIsLoading(false);
              });
          }
        }, 1000); // Wait 1 second before making API call
      
        return () => clearTimeout(delayFetch); // Cleanup previous timeout
    }, [type, bounds]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* ✅ Pass setCoordinates to Header */}
            <Header setCoordinates={setCoordinates} />  
            <Grid container spacing={3} style={{ width: "100%" }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places} 
                        childClicked={childClicked} 
                        isLoading={isLoading} 
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default App;
