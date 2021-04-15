import React from 'react';
import PropTypes from 'prop-types'; 

function BooleanRendering({bool}) {
    return bool.value ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>;
}

export default BooleanRendering;

BooleanRendering.propTypes = {
    bool: PropTypes.object.isRequired
};
