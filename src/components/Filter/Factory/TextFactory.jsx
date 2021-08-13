/* eslint-disable class-methods-use-this */
import React from 'react';
import Text from '../Field/Text';

class TextFactory {
    getType() {
        return 'string';
    }

    create({ column, onChange, value }) {
        return (
            <Text
                label={column.label}
                value={value}
                key={column.key}
                onChange={onChange}
                className="filter-basic-style"
            />
        );
    }
}

export default TextFactory;
