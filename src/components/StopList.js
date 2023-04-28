import React from 'react';
import { useState } from 'react';

import { makeStyles } from '@mui/styles';

import { List, ListItem, ListItemText} from '@mui/material';
import { Menu, MenuItem} from '@mui/material';
import { Typography } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

const useStyles = makeStyles({
    stopListbutton:{
        flexGrow: 1,
    }
})

export default function StopList({handleSelection}) {
    const classes = useStyles();

    const [bookmarks,updateBookmarks] = useState([
        {stopid:"0100",intersection:"Main & West"},
        {stopid:"1100",intersection:"Main & East"},
        {stopid:"1505",intersection:"Chuch & Main"},
        {stopid:"1878",intersection:"Prospect & Church"}
    ]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        handleSelection(bookmarks[index].stopid)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
        <List
            component="nav"
            sx={{ bgcolor: 'inherit' }}
        >
            <ListItem onClick={handleClickListItem}>
                <ArrowDropDownIcon fontSize="large"/>
                <ListItemText
                    primaryTypographyProps={{ sx: { lineHeight: '1.5' } }}                              
                    primary={bookmarks[selectedIndex].stopid}
                    secondary={bookmarks[selectedIndex].intersection}
                />
            </ListItem>
                
        </List>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            {bookmarks.map((stop, index) => (
                <MenuItem
                    key={stop.stopid}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                >
                    <Typography variant="subtitle1"
                       sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >                        
                        {stop.stopid} 
                        <PlaceOutlinedIcon 
                            sx={{ minWidth: '40px'}}
                            fontSize='small'
                        /> 
                        {stop.intersection}
                    </Typography>
                </MenuItem>
            ))}
        </Menu>
        </div>
    );
}