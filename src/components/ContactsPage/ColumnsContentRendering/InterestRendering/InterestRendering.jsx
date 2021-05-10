/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

const InterestRendering = ({ interest }) => interest.value.map((element, index) => (
    <span key={index} className="interests-badge">
        <span>
            {element.charAt(0).toUpperCase() + element.slice(1)}
        </span>
    </span>
));

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.objectOf(Object).isRequired,
};
