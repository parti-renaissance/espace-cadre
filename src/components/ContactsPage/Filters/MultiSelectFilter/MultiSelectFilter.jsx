import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

// A multiselect dropdown
const MultiSelectFilter = ({ column: { setFilter, interests } }) => {
    const [categories, setCategories] = useState([]);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '30px',
            height: '30px',
        }),

        valueContainer: (provided) => ({
            ...provided,
            height: '30px',
            padding: '0 6px',
        }),

        input: (provided) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '30px',
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: '12px',
            fontFamily: ['Poppins', 'sans-serif'],
            textAlign: 'center',
            padding: '6px 12px',
            borderRadius: '6px',
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
