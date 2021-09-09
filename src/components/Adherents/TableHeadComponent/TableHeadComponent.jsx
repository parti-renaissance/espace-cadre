import React from 'react';
import { TableHead, TableRow, TableCell } from '@material-ui/core';
import PropTypes from 'prop-types';

function TableHeadComponent({ columnsTitle }) {
    return (
        <TableHead id="sticky-tableHead">
            <TableRow>
                {columnsTitle && columnsTitle.map((columnTitle) => (
                    <TableCell key={columnTitle.key}>{columnTitle.label}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default TableHeadComponent;

TableHeadComponent.propTypes = {
    columnsTitle: PropTypes.arrayOf(Object).isRequired,
};
