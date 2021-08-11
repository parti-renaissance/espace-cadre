/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import {
    Grid, FormControl, InputLabel, MenuItem, Select, Input, Checkbox, ListItemText,
} from '@material-ui/core';
import { useColumnsTitleCache } from '../../../redux/contacts/hooks';

function FiltersBlock() {
    const [columnsTitle] = useColumnsTitleCache();
    const filteredColumnsTitle = columnsTitle && columnsTitle.filter((columnTitle) => 'filter' in columnTitle);
    const [gender, setGender] = useState([]);
    const [interests, setInterests] = useState([]);

    const handleInterestsChange = (event) => {
        setInterests(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const filtersContent = filteredColumnsTitle && filteredColumnsTitle.map((column) => {
        if (column.key === 'interests' && column.filter.type === 'select') {
            const selectOptions = Object.keys(column.filter.options.choices);

            return (
                <FormControl className="contacts-select">
                    <InputLabel id="contacts-mutiple-select">{column.label}</InputLabel>
                    <Select
                        labelId="contacts-mutiple-select"
                        id="contacts-mutiple-checkbox"
                        multiple
                        value={interests}
                        onChange={handleInterestsChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {selectOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                <Checkbox checked={interests.indexOf(option) > -1} />
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        if (column.filter.type === 'select') {
            const selectOptions = Object.values(column.filter.options.choices);
            return (
                <FormControl className="contacts-select">
                    <InputLabel id="contacts-single-select">{column.label}</InputLabel>
                    <Select
                        labelId="contacts-single-select"
                        id="contacts-single-select-outlined"
                        value={gender}
                        onChange={handleGenderChange}
                        label={column.label}
                    >
                        {
                            selectOptions.map((option, index) => (
                                <MenuItem value={option} key={index}>
                                    <em>{option.charAt(0).toUpperCase() + option.slice(1)}</em>
                                </MenuItem>
                            ))
                        }

                    </Select>
                </FormControl>
            );
        }
    });

    return (
        <Grid item xs={12} className="with-background dc-container filters-block-container">
            <div>
                {filtersContent}
            </div>
        </Grid>
    );
}

export default FiltersBlock;
