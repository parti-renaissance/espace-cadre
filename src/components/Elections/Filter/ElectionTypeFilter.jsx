import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ElectionTypeFilter = ({ electionList }) => {
    const [selectedElection, setSelectedElection] = useState('');

    const handleSelectedElection = (e) => {
        setSelectedElection(e.target.value);
    };

    console.log(selectedElection);

    return (
        <select
            className="mr-3"
            value={selectedElection}
            onChange={handleSelectedElection}
        >
            <option>Type d&apos;élection</option>
            {electionList && electionList.map((election, index) => (
                <option
                    key={index + 1}
                    value={election}
                >
                    {election}
                </option>
            ))}
        </select>
    );
};

export default ElectionTypeFilter;

ElectionTypeFilter.propTypes = {
    electionList: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};
