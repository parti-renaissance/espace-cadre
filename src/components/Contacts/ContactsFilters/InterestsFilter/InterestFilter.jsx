import React from 'react';
import {
    Grid, FormControl, InputLabel, MenuItem, Select, Input, Checkbox, ListItemText,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useInterestsCache } from '../../../../redux/contacts/hooks';

function InterestFilter(props) {
    const [interests, setInterests] = useInterestsCache();
    const { column } = props;
    const selectOptions = Object.entries(column.messages);

    const handleInterestsChange = (event) => {
        setInterests(event.target.value);
    };

    return (
        <Grid item>
            <FormControl className="filter-basic-style">
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
                        <MenuItem key={option} value={option[0]}>
                            <Checkbox checked={interests.indexOf(option[0]) > -1} />
                            <ListItemText primary={option[1]} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
}

export default InterestFilter;

InterestFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
