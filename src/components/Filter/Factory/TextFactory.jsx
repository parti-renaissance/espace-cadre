import React from 'react';
import Text from '../Field/Text';

class TextFactory {
    getType() {
        return 'text';
    }

    create({ column, onChange, value }) {
        return <Text label={column.label} value={value} key={column.key} onChange={onChange} />;
    }
}

export default TextFactory;
