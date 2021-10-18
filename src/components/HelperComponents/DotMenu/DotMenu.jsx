/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { IconButton, makeStyles, createStyles } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        fontSize: '13px',
        padding: '4px 12px',
        borderRadius: '8.35px',
        background: theme.palette.gray100,
        '&:hover': {
            background: theme.palette.gray200,
        },
    },
}));

const DotMenu = ({ item, handleActiveItem }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
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
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        handleActiveItem(item.uuid);
                    }}
                    className={classes.root}
                >{item.enabled ? 'Désactiver' : 'Activer'}
                </MenuItem>
            </Menu>
        </div>
    );
};

export default DotMenu;

DotMenu.propTypes = {
    item: PropTypes.object.isRequired,
    handleActiveItem: PropTypes.func.isRequired,
};
