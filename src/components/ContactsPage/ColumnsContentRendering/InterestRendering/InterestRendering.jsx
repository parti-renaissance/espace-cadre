/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

const InterestRendering = ({ interest }) => interest.value.map((element, index) => (
    <span key={index}>
        <span className="badge badge-info">
            {element}
        </span>
    </span>
));

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.objectOf(Object).isRequired,
};
