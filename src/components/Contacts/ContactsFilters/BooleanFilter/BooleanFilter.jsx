import React from 'react';
import {
    Grid, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useEmailCache, usePhoneCache } from '../../../../redux/contacts/hooks';

function BooleanFilter({ column }) {
    const [phone, setPhone] = usePhoneCache();
    const [email, setEmail] = useEmailCache();

    const handleChange = (event) => {
        if (column.key === 'subscribedEmail') {
            setEmail({ subscribedEmail: event.target.value });
        } else {
            setPhone({ subscribedPhone: event.target.value });
        }
    };

    return (
        <Grid item className="filter-basic-style">
            <FormControl style={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label">{column.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={column.key === 'subscribedEmail' ? email.subscribedEmail : phone.subscribedPhone}
                    onChange={handleChange}
                >
                    <MenuItem value>Oui</MenuItem>
                    <MenuItem value={false}>Non</MenuItem>
                </Select>
            </FormControl>
        </Grid>
    );
}

export default BooleanFilter;

BooleanFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
