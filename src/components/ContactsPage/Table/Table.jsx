/* eslint-disable react/jsx-props-no-spreading,react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import {
    useTable,
    useGlobalFilter,
    useFilters,
    usePagination,
} from 'react-table';
import ExportCSV from '../ExportToExcel/ExportCSV';
import GlobalFilter from '../Filters/GlobalFilter';

import './Table.scss';

const Table = ({ columns, data, defaultColumn }) => {
    const fileName = 'Contacts';
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: { pageSize: 40 },
    },
    useGlobalFilter,
    useFilters,
    usePagination);
    const { globalFilter, pageIndex, pageSize } = state;
    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <div className="d-flex paginationTop">
                <ExportCSV
                    csvData={data}
                    fileName={fileName}
                />
                {' '}
                <span style={{ borderLeft: '1px solid lightgrey', height: '2rem' }} />
                {' '}
                <select
                    className="p-1 border rounded ml-1"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {
                        [40, 60, 100].map((size) => (
                            <option key={size} value={size}>
                                Afficher {size} contacts
                            </option>
                        ))
                    }
                </select>
            </div>
            <table
                className="table table-bordered table-striped"
                id="contacts-table"
                {...getTableProps()}
            >
                <thead>
                    {headerGroups.map((headerGroup, i) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                            {headerGroup.headers.map((column, y) => (
                                <th {...column.getHeaderProps()} key={`${i}-${y}`}>
                                    {column.render('Header')}
                                    <div id="singleFilter">{column.canFilter ? column.render('Filter') : null}</div>
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
                                {row.cells.map((cell, y) => <td {...cell.getCellProps()} key={`${i}-${y}`}>{cell.render('Cell')}</td>)}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="paginationBottom">
                <span className="mr-2">
                    Page
                    {' '}
                    <strong>
                        {pageIndex + 1}
                        {' '}
                        of
                        {' '}
                        {pageOptions.length}
                    </strong>
                    {' '}
                    <span style={{ borderLeft: '1px solid lightgrey', height: '1rem' }} />
                    {' '}
                </span>
                <span>
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
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                >
                    {'<<'}
                </button>
                {' '}
                <button
                    type="button"
                    className="btn btn-light mr-2"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    Previous page
                </button>
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                >
                    Next page
                </button>
                {' '}
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {'>>'}
                </button>
            </div>
        </>
    );
};

export default Table;

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultColumn: PropTypes.objectOf(Object).isRequired,
};
