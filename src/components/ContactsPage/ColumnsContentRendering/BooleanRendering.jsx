import React from 'react';
import PropTypes from 'prop-types';

function BooleanRendering({ bool }) {
    return bool.value
        ? <i className="fas fa-check" />
        : <i className="fas fa-times" />;
}

export default BooleanRendering;

BooleanRendering.propTypes = {
    bool: PropTypes.objectOf(Object).isRequired,
};
