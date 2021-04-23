/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

const InterestRendering = ({ interest }) => interest.value.map((element, index) => (
    <span key={index} className="badge badge-primary mr-2">
        <span>
            {element}
        </span>
    </span>
));

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.objectOf(Object).isRequired,
};
