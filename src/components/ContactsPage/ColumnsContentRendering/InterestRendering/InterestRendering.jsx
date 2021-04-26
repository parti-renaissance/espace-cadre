/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import './InterestRendering.scss';

const InterestRendering = ({ interest }) => interest.value.map((element, index) => (
    <span key={index} className="interestsBadge">
        <span>
            {element.charAt(0).toUpperCase() + element.slice(1)}
        </span>
    </span>
));

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.objectOf(Object).isRequired,
};
