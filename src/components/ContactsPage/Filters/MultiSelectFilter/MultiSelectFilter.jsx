import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

// A multiselect dropdown
const MultiSelectFilter = ({ column: { setFilter, interests } }) => {
    const [categories, setCategories] = useState([]);

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            fontSize: '12px',
            fontFamily: ['Poppins', 'sans-serif'],
            textAlign: 'center',
            padding: '6px 12px',
            borderRadius: '12px',
            border: 'none',
            outline: 'none',
            textTransform: 'uppercase',
        }),
    };

    useEffect(() => {
        if (interests) {
            setCategories(interests.map((element) => ({
                value: element,
                label: element,
            })));
        }
    }, []);

    return (
        <div>
            <Select
                id="multiSelect"
                styles={customStyles}
                isMulti
                options={categories}
                onChange={(data) => {
                    setFilter(data.map((el) => el.value) || undefined);
                }}
            />
        </div>
    );
};

export default MultiSelectFilter;

MultiSelectFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
