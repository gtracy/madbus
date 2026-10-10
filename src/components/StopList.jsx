import React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemText} from '@mui/material';
import { Menu, MenuItem} from '@mui/material';
import { Typography } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useBookmarks } from '../bookmarks';
import { gaEvents } from '../analytics';


export default function StopList({activeStopID, handleSelection}) {
    const { bookmarks, setBookmarks } = useBookmarks();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);

    const open = Boolean(anchorEl);

    // Compute active stop ID based on activeStopID prop or default to first bookmark
    const currentActiveStopID = activeStopID || (bookmarks.length > 0 ? bookmarks[0].stop_code : '');
    const selectedIndex = bookmarks.findIndex(bookmark => bookmark.stop_code === currentActiveStopID);
    const activeIndex = selectedIndex !== -1 ? selectedIndex : 0;

    const handleClickListItem = (event) => {
        gaEvents.buttonClick("stopList dropdown");
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        gaEvents.buttonClick("stopList picker");

        setAnchorEl(null);
        setShowDeleteButtons(false);
        handleSelection(bookmarks[index].stop_code)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowDeleteButtons(false);
    };

    const handleDeleteClick = (stop_code, index) => {
        gaEvents.buttonClick("stopList delete item");

        const newBookmarks = bookmarks.filter(bookmark => bookmark.stop_code !== stop_code);
        setBookmarks(newBookmarks);

        if (stop_code === currentActiveStopID) {
            const nextStopCode = newBookmarks.length > 0
                ? newBookmarks[0].stop_code
                : '2389'; // fallback stop code
            handleSelection(nextStopCode);
        }
    }
    
    const handleMenuAddClick = (event) => {
        gaEvents.buttonClick("stopList add");

        navigate('/map');
    }
    const handleMenuEditClick = () => {
        if( showDeleteButtons ) gaEvents.buttonClick("stopList edit start");
        else gaEvents.buttonClick("stopList edit done");
        setShowDeleteButtons(!showDeleteButtons);
    }

    return (
        <div>
        <List
            component="nav"
            sx={{ bgcolor: 'inherit' }}
        >
            <ListItem
                sx={{ padding:0, paddingLeft:1, margin:0}}
                onClick={handleClickListItem}
            >
                <ArrowDropDownIcon fontSize="large"/>
                <ListItemText
                    slotProps={{ primary: { sx: { lineHeight: '1.5' } } }}                              
                    primary={bookmarks[activeIndex].stop_code}
                    secondary={bookmarks[activeIndex].intersection}
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
                    key={stop.stop_code}
                    selected={index === activeIndex}
                >
                    {showDeleteButtons && (
                        <Button 
                            sx={{ padding: '0px 4px 0px 0px', margin: '0px', minWidth: '12px' }}
                            color="primary" 
                            onClick={(event) => handleDeleteClick(stop.stop_code, index)}>
                            <DeleteIcon />
                        </Button>
                    )}

                    <Button
                        sx={{paddingTop: 0, paddingBottom:0}}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        <Box sx={{ margin: 0, padding:0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                            <Typography 
                                variant="subtitle2"
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >                        
                                {stop.stop_code} 
                                <PlaceOutlinedIcon 
                                    sx={{ minWidth: '30px'}}
                                    fontSize='small'
                                /> 
                                {stop.intersection}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ margin: 0, padding: 0, fontSize: '10px' }}
                            >
                                {stop.direction}
                            </Typography>

                        </Box>
                    </Button>
                </MenuItem>
            ))}
            <hr/>
            <MenuItem sx={{ padding: '0px 0px 0px 4px', margin: '0px 0px 0px 4px', minHeight: '12px' }}>
                <Button onClick={handleMenuAddClick}>
                    <AddBoxRoundedIcon/> 
                    <Typography sx={{ ml: 1 }}>Add</Typography>
                </Button>
            </MenuItem>
            {!showDeleteButtons ? <div>
                <MenuItem sx={{ padding: '0px 0px 0px 4px', margin: '0px 0px 0px 4px', minHeight: '12px' }}>
                    <Button onClick={handleMenuEditClick}>
                        <EditLocationAltIcon/>
                        <Typography sx={{ ml: 1 }}>Edit</Typography>
                    </Button>
                </MenuItem>
            </div> : <div>
                <MenuItem sx={{ padding: '0px 0px 0px 4px', margin: '0px 0px 0px 4px', minHeight: '12px' }}>
                    <Button onClick={handleMenuEditClick}>
                        <CheckCircleIcon
                            color="success"
                        />
                        <Typography sx={{ ml: 1 }}>Done</Typography>
                    </Button>
                </MenuItem>
            </div>}
        </Menu>
        </div>
    );
}