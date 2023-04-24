import React from 'react';
import { useState, useEffect } from 'react';

import { makeStyles } from '@mui/styles';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


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
            <ListItem
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="when device is locked"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
            >
            <ListItemText
                primary={bookmarks[selectedIndex].stopid}
            />
            <ArrowDropDownIcon/>
            </ListItem>
            {bookmarks[selectedIndex].intersection}
        </List>
        <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
            }}
        >
            {bookmarks.map((stop, index) => (
            <MenuItem
                key={stop.stopid}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
            >
                {stop.stopid}
            </MenuItem>
            ))}
        </Menu>
        </div>
    );
}