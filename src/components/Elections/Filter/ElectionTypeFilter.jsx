import React from 'react';
import PropTypes from 'prop-types';

const ElectionTypeFilter = ({ onChange, choices, value }) => (
    <select
        className="mr-3"
        value={value}
        onChange={choices.length ? onChange : null}
        disabled={!choices.length}
    >
        <option>Type d&apos;élection</option>
        {choices.length && choices.map((election, i) => (
            <option key={i + 1} value={election.code}>
                {election.label}
            </option>
        ))}
    </select>
);

export default ElectionTypeFilter;

ElectionTypeFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    choices: PropTypes.instanceOf(Object).isRequired,
    value: PropTypes.string,
};

ElectionTypeFilter.defaultProps = {
    value: null,
};
