/* eslint-disable react/jsx-props-no-spreading,no-shadow */
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

import GlobalFilter from '../Filters/GlobalFilter';

const Table = ({ columns, data }) => {
    // Handle export button logic
    function getExportFileBlob({ columns, data }) {
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
        <div className="table-container">
            <div className="row aboveTableRow pl-3">
                <GlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                    count={preGlobalFilteredRows}
                />
                <button
                    type="button"
                    className="dc-container btn mr-3 mb-3"
                    id="filter-button"
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
                    className="btn dc-container mr-3"
                    id="download-button"
                >
                    <i className="fas fa-download" />
                </button>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="line-count dc-container mr-3 mb-3"
                >
                    {
                        [20, 40, 60, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))
                    }
                </select>
                <div className="contacts-count mb-3 mt-lg-2">
                    <span className="page-size">{rows.length}</span> sur {data.length} contacts
                </div>
            </div>

            <table
                className="table table-responsive dc-container"
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
            <div className="row bottom-container pl-3 pr-3 mb-3 d-flex justify-content-center justify-content-sm-between">
                <div className="page-count-bottom mr-3 mb-3 my-auto">
                    <span>Page <strong>{pageIndex + 1} of {pageOptions.length}</strong></span>
                </div>
                <div className="pageNav">
                    <button
                        type="button"
                        className="btn mr-1 dc-container"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {'<<'}
                    </button>
                    <button
                        type="button"
                        className="btn mr-1 dc-container"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className="btn mr-1 dc-container"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        className="btn dc-container"
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
