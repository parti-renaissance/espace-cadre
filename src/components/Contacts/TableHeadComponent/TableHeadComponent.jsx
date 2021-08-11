import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, Checkbox,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function TableHeadComponent({ columnsTitle }) {
    return (
        <TableHead className="with-background dc-container contacts-mui-table">
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox />
                </TableCell>
                {columnsTitle && columnsTitle.map((columnTitle) => (
                    <TableCell
                        key={columnTitle.key}
                    >
                        <TableSortLabel>
                            {columnTitle.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default TableHeadComponent;

TableHeadComponent.propTypes = {
    columnsTitle: PropTypes.arrayOf(Object).isRequired,
};
