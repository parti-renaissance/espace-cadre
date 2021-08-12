/* eslint-disable no-unused-expressions */
import React from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
} from '@material-ui/core';
import InterestFilter from './InterestsFilter';
import SelectFilter from './SelectFilter';
import TextFilter from './TextFilter';
import Loader from '../../Loader';
import BooleanFilter from './BooleanFilter';

function ContactsFilters({ columnsTitle }) {
    // Si la colonne n'a pas de clé filtre, elle n'apparait pas dans le bloc de filtre
    const filteredColumnsTitle = columnsTitle && columnsTitle.filter((columnTitle) => 'filter' in columnTitle);

    const filtersContent = filteredColumnsTitle && filteredColumnsTitle.map((column, index) => {
        if (column.key === 'interests' && column.filter.type === 'select') {
            return <InterestFilter column={column} key={index} />;
        }
        if (column.filter.type === 'select') {
            return <SelectFilter column={column} key={index} />;
        }
        if (column.filter.type === 'text' || column.filter.type === 'string') {
            return (
                <TextFilter column={column} key={index} />
            );
        }
        if (column.filter.type === 'boolean') {
            return (
                <BooleanFilter column={column} key={index} />
            );
        }
        return <Loader key={index} />;
    });

    return (
        <Grid container className="with-background dc-container filters-block-container">
            {filtersContent}
        </Grid>
    );
}

export default ContactsFilters;

ContactsFilters.propTypes = {
    columnsTitle: PropTypes.arrayOf(Object).isRequired,
};
