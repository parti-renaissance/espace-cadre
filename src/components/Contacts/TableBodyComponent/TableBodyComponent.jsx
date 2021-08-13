/* eslint-disable react/prop-types */
import React from 'react';
import {
    TableBody, TableRow, TableCell,
} from '@material-ui/core';

function TableBodyComponent({ columnsTitle, contacts }) {
    const { metadata, items } = contacts;

    return (
        <TableBody>
            {items && items.map((adherent, index) => {
                columnsTitle.map((column) => {
                    console.log('Mix', adherent[column.key]);
                    return (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {adherent[column.key]}
                            </TableCell>
                            <TableCell align="right">
                                {adherent[column.key]}
                            </TableCell>
                        </TableRow>

                    );
                });
            })}

        </TableBody>
    );
}

export default TableBodyComponent;
