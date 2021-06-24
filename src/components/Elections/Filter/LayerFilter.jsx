import React from 'react';
import PropTypes from 'prop-types';

const LayerFilter = ({ onChange, choices }) => (
    <select className="mb-3 mr-3" onChange={onChange}>
        {choices.map((layer, i) => <option key={i + 1} value={layer.code}>{layer.label}</option>)}
    </select>
);

export default LayerFilter;

LayerFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    choices: PropTypes.instanceOf(Object).isRequired,
};
