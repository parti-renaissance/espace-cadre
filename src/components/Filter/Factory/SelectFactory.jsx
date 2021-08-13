import React from 'react';
import Select from '../Field/Select';

class SelectFactory {
    getType() {
        return 'select';
    }

    create({ column, onChange }) {
        return <Select key={column.key} label={column.label} onChange={onChange} />;
    }
}

export default SelectFactory;
