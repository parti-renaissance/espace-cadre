import React from 'react';
import PropTypes from 'prop-types'; 

const InterestCenter = ({ values }) => {
    return (
        <>
            {values.map((element, index) => {
                return (
                    <span key={index} className="badge badge-success">
                        {element}
                    </span>
                );
            })}
        </>
    );
};

export default InterestCenter;

InterestCenter.propTypes = {
    values: PropTypes.array
};