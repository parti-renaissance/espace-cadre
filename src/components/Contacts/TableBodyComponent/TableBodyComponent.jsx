/* eslint-disable react/prop-types */
import React from 'react';
import {
    TableBody, TableRow, TableCell,
} from '@material-ui/core';

function TableBodyComponent({ columnsTitle, contacts }) {
    const { metadata, items } = contacts;

    return (
        <TableBody>
            {items && items.map((adherent, index) => (
                <TableRow key={index}>
                    {columnsTitle.map((column, i) => {
                        let value = adherent[column.key];

                        if (column.type === 'trans') {
                            value = column.messages[value];
                        }

                        return (
                            <TableCell key={`${index}-${i}`}>{value}</TableCell>
                        );
                    })}
                </TableRow>
            ))}

        </TableBody>
    );
}

export default TableBodyComponent;
