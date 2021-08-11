/* eslint-disable no-unused-expressions */
import React from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
} from '@material-ui/core';
import InterestFilter from './InterestsFilter';
import SelectFilter from './SelectFilter';
import TextFilter from './TextFilter';

function FiltersBlock({ columnsTitle }) {
    const filteredColumnsTitle = columnsTitle && columnsTitle.filter((columnTitle) => 'filter' in columnTitle);

    const filtersContent = filteredColumnsTitle && filteredColumnsTitle.map((column, index) => {
        if (column.key === 'interests' && column.filter.type === 'select') {
            return <InterestFilter column={column} key={index} />;
        }
        if (column.filter.type === 'select') {
            return <SelectFilter column={column} key={index} />;
        }
        if (column.filter.type === 'text') {
            return (
                <TextFilter column={column} key={index} />
            );
        }
    });
    console.log(columnsTitle);
    return (
        <Grid container className="with-background dc-container filters-block-container">
            {filtersContent}
        </Grid>
    );
}

export default FiltersBlock;

FiltersBlock.propTypes = {
    columnsTitle: PropTypes.arrayOf(Object).isRequired,
};
