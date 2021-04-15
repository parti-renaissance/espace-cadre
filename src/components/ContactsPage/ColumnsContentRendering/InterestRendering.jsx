import React from 'react';
import PropTypes from 'prop-types'; 

const InterestRendering = ({ interest }) => {
    return interest.value.map((element, index) => (
        <div key={index}>
            <div className="badge badge-info">
                {element}
            </div> {' '}
        </div>
    )
    )
};

export default InterestRendering;

InterestRendering.propTypes = {
    interest: PropTypes.object.isRequired
};