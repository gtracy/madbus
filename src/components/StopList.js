import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import { Button, List, ListItem, ListItemText} from '@mui/material';
import { Box, Menu, MenuItem} from '@mui/material';
import { Typography } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

import { useBookmarks } from '../bookmarks';

const useStyles = makeStyles({
    menuAction: {
        padding: '0px 0px 0px 4px',
        margin: '0px 0px 0px 4px',
        minHeight: '12px'
    },
  });
  

export default function StopList({handleSelection}) {
    const { bookmarks } = useBookmarks();
    const navigate = useNavigate();
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const open = Boolean(anchorEl);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        handleSelection(bookmarks[index].stopID)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuAddClick = (event) => {
        navigate('/map');
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
                    onClick={(event) => handleMenuItemClick(event, index)}
                >
                    <Typography variant="subtitle1"
                       sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >                        
                        {stop.stopID} 
                        <PlaceOutlinedIcon 
                            sx={{ minWidth: '40px'}}
                            fontSize='small'
                        /> 
                        {stop.intersection}
                    </Typography>
                </MenuItem>
            ))}
            <hr/>
            <MenuItem className={classes.menuAction}>
                <Button onClick={handleMenuAddClick}>
                    <AddBoxRoundedIcon/> 
                    <Typography ml={1}>Add</Typography>
                </Button>
            </MenuItem>
            <MenuItem className={classes.menuAction}>
                <Button onClick={handleMenuAddClick}>
                    <EditLocationAltIcon/>
                    <Typography ml={1}>Edit</Typography>                
                </Button>
            </MenuItem>
        </Menu>
        </div>
    );
}