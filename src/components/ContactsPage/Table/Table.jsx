/* eslint-disable react/jsx-props-no-spreading,react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import {
    useTable,
    useGlobalFilter,
    useFilters,
    usePagination,
} from 'react-table';
import { useExportData } from 'react-table-plugins';
import * as XLSX from 'xlsx';
import GlobalFilter from '../Filters/GlobalFilter/GlobalFilter';

const Table = ({ columns, data }) => {
    // Handle export button logic
    function getExportFileBlob({
        // eslint-disable-next-line no-shadow
        columns, data,
    }) {
        const header = columns.map((c) => c.exportValue);
        const compatibleData = data.map((row) => {
            const obj = {};
            header.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });

        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(compatibleData, {
            header,
        });
        XLSX.utils.book_append_sheet(wb, ws1, 'Contacts table');
        XLSX.writeFile(wb, 'Contacts.xlsx');
        // Returning false as downloading of file is already taken care of
        return false;
    }

    const tableInstance = useTable({
        initialState: { pageSize: 20 },
        data,
        columns,
        getExportFileBlob,
    },
    useGlobalFilter,
    useFilters,
    usePagination,
    useExportData);

    const {
        state: { globalFilter, pageIndex, pageSize },
        getTableProps,
        getTableBodyProps,
        preGlobalFilteredRows,
        rows,
        headerGroups,
        page,
        prepareRow,
        setPageSize,
        setGlobalFilter,
        setAllFilters,
        exportData,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
    } = tableInstance;

    return (
        <div className="tableContainer">
            <div className="row aboveTableRow pl-3">
                <GlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                    count={preGlobalFilteredRows}
                    className="globalFilter"
                />
                <button
                    type="button"
                    className="btn mr-3 mb-3"
                    id="filterButton"
                    onClick={() => setAllFilters([])}
                >
                    <span>Réinitialiser les filtres</span>
                    <i className="fas fa-filter" />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        exportData('xlsx', false);
                    }}
                    className="btn mr-3"
                    id="downloadButton"
                >
                    <i className="fas fa-download" />
                </button>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="lineCount mb-3"
                >
                    {
                        [20, 40, 60, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))
                    }
                </select>
            </div>

            <table
                className="table table-responsive"
                {...getTableProps()}
            >
                <thead>
                    {headerGroups.map((headerGroup, i) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                            {headerGroup.headers.map((column, y) => (
                                <th {...column.getHeaderProps()} key={`${i}-${y}`}>
                                    <span>{column.render('Header')}</span>
                                    <div>{column.render('Filter')}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, y) => <td {...cell.getCellProps()} key={`${i}-${y}`}><span>{cell.render('Cell')}</span></td>)}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="row bottomContainer">
                <div className="pageCountBottom">
                    <span>
                        Page
                        {' '}
                        <strong>
                            {pageIndex + 1}
                            {' '}
                            of
                            {' '}
                            {pageOptions.length}
                        </strong>
                    </span>
                </div>
                {/* <span>
                    Aller à la page:
                    {' '}
                    {' '}
                    <input
                        className="border rounded"
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                        }}
                    />
                    </span>
                {' '}
                {' '}
                */}
                <span className="contactsCount">
                    Affichage de {pageSize} contacts sur {rows.length}
                </span>

                <div className="pageNav">
                    <button
                        type="button"
                        className="btn mr-1"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {'<<'}
                    </button>
                    {' '}
                    <button
                        type="button"
                        className="btn mr-1"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className="btn mr-1"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        Next
                    </button>
                    {' '}
                    <button
                        type="button"
                        className="btn"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
