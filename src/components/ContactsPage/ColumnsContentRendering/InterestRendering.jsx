import React from 'react';
import PropTypes from 'prop-types'; 

const InterestRendering = ({ interest }) => {
    return interest.value.map((element, index) => (
        <span key={index}>
            <span className="badge badge-info">
                {element}
            </span> {' '}
        </span>
    )
    )
};

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.object.isRequired
};