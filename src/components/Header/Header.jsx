import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import useStyles from './styles';

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar position='static'>
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
                            placeholder='Search...'
                            classes={{ root: classes.inputRoot, input: classes.inputInput }}
                            inputProps={{ style: { paddingLeft: '2em', color: "white" } }}
                        />
                    </div>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
