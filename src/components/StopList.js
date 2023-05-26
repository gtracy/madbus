import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import { Button, List, ListItem, ListItemText} from '@mui/material';
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


const useStyles = makeStyles({
    menuAction: {
        padding: '0px 0px 0px 4px',
        margin: '0px 0px 0px 4px',
        minHeight: '12px'
    },
    deleteButton: {
        padding: '0px 4px 0px 0px',
        margin: '0px',
        minWidth: '12px',
    }
  });
  

export default function StopList({handleSelection}) {
    const { bookmarks, setBookmarks } = useBookmarks();
    const navigate = useNavigate();
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);

    const open = Boolean(anchorEl);

    const handleClickListItem = (event) => {
        gaEvents.buttonClick("stopList dropdown");
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        gaEvents.buttonClick("stopList picker");

        setSelectedIndex(index);
        setAnchorEl(null);
        setShowDeleteButtons(false);
        handleSelection(bookmarks[index].stopID)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowDeleteButtons(false);
    };

    const handleDeleteClick = (stopID,index) => {
        gaEvents.buttonClick("stopList delete item");

        setBookmarks(bookmarks.filter(bookmark => bookmark.stopID !== stopID));
        setSelectedIndex(0);
        handleSelection(bookmarks[0].stopID);
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
            <ListItem onClick={handleClickListItem}>
                <ArrowDropDownIcon fontSize="large"/>
                <ListItemText
                    primaryTypographyProps={{ sx: { lineHeight: '1.5' } }}                              
                    primary={bookmarks[selectedIndex].stopID}
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
                    key={stop.stopID}
                    selected={index === selectedIndex}
                >
                    {showDeleteButtons && (
                        <Button 
                            className={classes.deleteButton}
                            color="primary" 
                            onClick={(event) => handleDeleteClick(stop.stopID, index)}>
                            <DeleteIcon />
                        </Button>
                    )}

                    <Button
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        <Typography variant="subtitle2"
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >                        
                            {stop.stopID} 
                            <PlaceOutlinedIcon 
                                sx={{ minWidth: '30px'}}
                                fontSize='small'
                            /> 
                            {stop.intersection}
                        </Typography>
                    </Button>
                </MenuItem>
            ))}
            <hr/>
            <MenuItem className={classes.menuAction}>
                <Button onClick={handleMenuAddClick}>
                    <AddBoxRoundedIcon/> 
                    <Typography ml={1}>Add</Typography>
                </Button>
            </MenuItem>
            {!showDeleteButtons ? <div>
                <MenuItem className={classes.menuAction}>
                    <Button onClick={handleMenuEditClick}>
                        <EditLocationAltIcon/>
                        <Typography ml={1}>Edit</Typography>
                    </Button>
                </MenuItem>
            </div> : <div>
                <MenuItem className={classes.menuAction}>
                    <Button onClick={handleMenuEditClick}>
                        <CheckCircleIcon
                            color="success"
                        />
                        <Typography ml={1}>Done</Typography>
                    </Button>
                </MenuItem>
            </div>}
        </Menu>
        </div>
    );
}