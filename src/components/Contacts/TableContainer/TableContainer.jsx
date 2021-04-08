import './TableContainer.scss';

import {
    useTable,
    useGlobalFilter,
    useFilters,
    usePagination
}
    from "react-table";

import GlobalFilter from '../GlobalFilter';
import { CSVLink } from "react-csv";

const TableContainer = ({ columns, data, defaultColumn }) => {
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
        initialState: { pageSize: 20 }
    },
        useGlobalFilter,
        useFilters,
        usePagination
    )

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <div className="d-flex paginationTop">
                <CSVLink
                    data={data}
                    filename={"contacts.csv"}
                    className="btn btn-outline-info btn-sm mx-1"
                    target="_blank">Export XLS
                </CSVLink>
                {' '}
                <span style={{ borderLeft: "1px solid lightgrey", height: "2rem" }}></span>
                {' '}
                <select
                    className="p-1 border rounded ml-1"
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                >
                    {
                        [40, 60, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Afficher {pageSize} contacts
                            </option>
                        ))
                    }
                </select>
            </div>
            <table
                className="table table-sm table-bordered table-striped table-hover"
                {...getTableProps()}
            >
                <thead className="text-center">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render("Header")}
                                    <div id="singleFilter">{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="paginationBottom">
            <span className="mr-2">
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                    {' '}
                    <span style={{ borderLeft: "1px solid lightgrey", height: "1rem" }}></span>
                    {' '}
                </span>
                <span>
                    Aller à la page: {' '}
                    <input
                        className="border rounded"
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                        }}
                    />
                </span> {' '}
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
    )
}

export default TableContainer