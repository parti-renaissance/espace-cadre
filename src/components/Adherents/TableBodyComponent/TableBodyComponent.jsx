/* eslint-disable react/prop-types */
import React from 'react';
import {
    TableBody, TableRow, TableCell, makeStyles, createStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => createStyles({
    interestsBubble: {
        backgroundColor: theme.palette.interestsBubble,
        padding: '1px 8px',
        color: theme.palette.blueCorner,
        borderRadius: '12px',
        '&:not(:last-child)': {
            marginRight: '4px',
        },
    },
    head: {
        fontSize: '12px',
        fontWeight: '600',
        background: theme.palette.whiteCorner,
        color: theme.palette.gray800,
        minWidth: '110px',
    },
    hoverBackground: {
        '&:hover': {
            background: `${theme.palette.gray100} !important`,
        },
    },
}));

function TableBodyComponent({ columnsTitle, adherents }) {
    const { items } = adherents;
    const classes = useStyles();

    return (
        <TableBody>
            {items && items.map((adherent, index) => (
                <TableRow key={index} hover classes={{ hover: classes.hoverBackground }}>
                    {columnsTitle.map((column, i) => {
                        let value = adherent[column.key];

                        if (column.type === 'trans' || column.type === 'array|trans') {
                            if (Array.isArray(value)) {
                                value = value.map((el, ind) => column.messages[el] !== undefined && <span key={ind} className={classes.interestsBubble}>{column.messages[el]}</span>);
                            } else {
                                value = column.messages[value];
                            }
                        }

                        if (column.type === 'boolean') {
                            if (value) {
                                value = <CheckIcon style={{ color: 'green' }} />;
                            } else {
                                value = <ClearIcon style={{ color: 'red' }} />;
                            }
                        }

                        return (
                            <TableCell key={`${index}-${i}`} classes={{ head: classes.head }}>{value}</TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
}

export default TableBodyComponent;
