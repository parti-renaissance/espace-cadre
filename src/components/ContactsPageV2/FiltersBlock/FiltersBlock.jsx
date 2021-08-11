/* eslint-disable no-unused-expressions */
import React from 'react';
import {
    Grid, FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import { useColumnsTitleCache } from '../../../redux/contacts/hooks';

function FiltersBlock() {
    const [columnsTitle] = useColumnsTitleCache();
    const filteredColumnsTitle = columnsTitle && columnsTitle.filter((columnTitle) => 'filter' in columnTitle);

    const filtersContent = () => {
        filteredColumnsTitle && filteredColumnsTitle.map((column) => {
            if (column.filter.type === 'select') {
                console.log(column);
                return (
                    <FormControl variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            // value={age}
                            // onChange={handleChange}
                            label="Age"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                );
            }
        });
    };

    return (
        <Grid item xs={12} className="with-background dc-container filters-block-container">
            <div>
                {filtersContent()}
            </div>
        </Grid>
    );
}

export default FiltersBlock;
