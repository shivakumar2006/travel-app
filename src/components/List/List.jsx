import React, { useState, useEffect, createRef } from 'react'; 
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from "./styles";

const List = ({ places, childClicked, isLoading, type, setType, rating, setRating }) => {
    const classes = useStyles();
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        setElRefs((prevRefs) => 
            places.map((_, i) => prevRefs[i] || createRef()) // ✅ Fixes the "refs before initialization" issue
        );
    }, [places]);

    return (
        <div className={classes.container}> 
            <Typography variant="h4" style={{ fontSize: "25px", fontWeight: "500"}}>
                Restaurants, Hotels & Attractions Around You
            </Typography>
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : ( 
                <>
                    <FormControl className={classes.FormControl} style={{ marginTop: "5px"}}>
                        <InputLabel>Type</InputLabel>
                        <Select value={type} onChange={(e) => setType(e.target.value)} style={{ marginTop: "10px"}}>
                            <MenuItem value="restaurants">Restaurants</MenuItem>
                            <MenuItem value="hotels">Hotels</MenuItem>
                            <MenuItem value="attractions">Attractions</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.FormControl} style={{ marginTop: "15px", marginLeft: "5px"}}>
                        <Select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: "130px"}}>
                            <MenuItem value={0}>All</MenuItem>
                            <MenuItem value={3}>Above 3.0</MenuItem>
                            <MenuItem value={4}>Above 4.0</MenuItem>
                            <MenuItem value={4.5}>Above 4.5</MenuItem>
                        </Select>
                    </FormControl>
                    <Grid container spacing={3} className={classes.list} style={{ marginTop: "10px"}}>
                        {places?.map((place, i) => (
                            <Grid ref={elRefs[i]} item key={`${place.location_id}-${i}`} xs={12}>
                                <PlaceDetails 
                                    place={place} 
                                    selected={childClicked === place.location_id}
                                    refProp={elRefs[i]} 
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
}

export default List; // Wrap List component with React.memo
