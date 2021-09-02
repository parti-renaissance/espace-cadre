/* eslint-disable react/prop-types */
import React from 'react';
import {
    TableBody, TableRow, TableCell,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

function TableBodyComponent({
    columnsTitle, contacts, rowsPerPage, page,
}) {
    const { items } = contacts;

    return (
        <TableBody>
            {items && items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((adherent, index) => (
                    <TableRow key={index}>
                        {columnsTitle.map((column, i) => {
                            let value = adherent[column.key];

                            if (column.type === 'trans' || column.type === 'array|trans') {
                                if (Array.isArray(value)) {
                                    value = value.map((el, ind) => column.messages[el] !== undefined && <span key={ind} className="interests-bubble">{column.messages[el]}</span>);
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
                                <TableCell key={`${index}-${i}`}>{value}</TableCell>
                            );
                        })}
                    </TableRow>
                ))}

        </TableBody>
    );
}

export default TableBodyComponent;
