import React from 'react';
import PropTypes from 'prop-types';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ExportCSV = ({ csvData, fileName }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (content, name) => {
        const ws = XLSX.utils.json_to_sheet(content);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });

        saveAs(data, name + fileExtension);
    };

    return (
        <button
            type="button"
            className="btn btn-outline-info btn-sm mx-1"
            onClick={() => exportToCSV(csvData, fileName)}
        >
            Export to XLSX
        </button>
    );
};

export default ExportCSV;

ExportCSV.propTypes = {
    csvData: PropTypes.arrayOf(PropTypes.object).isRequired,
    fileName: PropTypes.string.isRequired,
};
