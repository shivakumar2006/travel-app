import React, { useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useStyles from "./styles";

const Header = ({ setCoordinates }) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState("");

    const onPlaceChanges = async (event) => {
        if (event.key === "Enter" && searchTerm.trim() !== "") {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch location data");
                }

                const data = await response.json();

                if (data.length > 0) {
                    const { lat, lon } = data[0]; // Get first result
                    setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });

                    console.log("Updated coordinates:", { lat: parseFloat(lat), lng: parseFloat(lon) });

                } else {
                    alert("Location not found. Try another search!");
                }
            } catch (error) {
                console.error("Error fetching location:", error);
                alert("Unable to fetch location. Please try again.");
            }
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
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search..."
                            classes={{ root: classes.inputRoot, input: classes.inputInput }}
                            inputProps={{
                                style: { paddingLeft: "2em", color: "white" },
                                onKeyDown: onPlaceChanges,
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
