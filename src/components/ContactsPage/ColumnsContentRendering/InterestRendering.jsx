import React from 'react';
import PropTypes from 'prop-types';

const InterestRendering = ({ interest }) => {
    if (interest.value[0] === '') {
        return '';
    }

    return (
        <>
            {interest.value.length > 0 && interest.value.map((element, index) => (
                <span key={index} className="interests-badge">
                    <span>
                        {element.charAt(0).toUpperCase() + element.slice(1)}
                    </span>
                </span>
            ))}
        </>
    );
};

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.objectOf(Object).isRequired,
};
