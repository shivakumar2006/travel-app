import React, { useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useStyles from "./styles";

const Header = ({ setCoordinates }) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState("");

    // Function to fetch location data
    const fetchLocation = async () => {
        if (!searchTerm.trim()) {
            alert("Please enter a valid location!");
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
            );

            if (!response.ok) throw new Error("Failed to fetch location");

            const data = await response.json();

            if (data.length === 0) {
                alert("Location not found. Try another search!");
                return;
            }

            // Get first result & update coordinates
            const { lat, lon } = data[0];
            setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });

        } catch (error) {
            console.error("Error fetching location:", error);
            alert("Unable to fetch location, please try again.");
        }
    };

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant="h5" className={classes.title}>
                    Travel Advisory
                </Typography>
                <Box display="flex">
                    <Typography variant="h6" className={classes.title}>
                        Explore new places
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon} onClick={fetchLocation}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search..."
                            classes={{ root: classes.inputRoot, input: classes.inputInput }}
                            inputProps={{
                                style: { paddingLeft: "2em", color: "white" },
                                onKeyPress: (e) => e.key === "Enter" && fetchLocation(),
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
