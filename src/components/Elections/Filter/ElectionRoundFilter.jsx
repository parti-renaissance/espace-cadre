import React from 'react';
import PropTypes from 'prop-types';

const ElectionRoundFilter = ({ onChange, choices, value }) => (
    <select
        className="mr-3"
        value={value}
        onChange={choices.length ? onChange : null}
        disabled={!choices.length}
    >
        <option>Tour d&apos;élection</option>
        {choices.length && choices.map((election, i) => (
            <option key={i + 1} value={election.code}>
                {election.label}
            </option>
        ))}
    </select>
);

export default ElectionRoundFilter;

ElectionRoundFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    choices: PropTypes.instanceOf(Object).isRequired,
    value: PropTypes.string,
};

ElectionRoundFilter.defaultProps = {
    value: null,
};
