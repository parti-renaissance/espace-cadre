/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const DotMenu = ({ item, handleClickMenu }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    handleClickMenu(item.uuid);
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <MenuItem
                    onClick={handleClose}
                >{item.enabled ? 'Activer' : 'Désactiver'}
                </MenuItem>
            </Menu>
        </div>
    );
};

export default DotMenu;

DotMenu.propTypes = {
    item: PropTypes.object.isRequired,
    handleClickMenu: PropTypes.func.isRequired,
};
