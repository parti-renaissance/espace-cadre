import React, { useState, useEffect } from "react";
import Select from 'react-select'
import PropTypes from 'prop-types';

// A multiselect dropdown
const MultiSelectFilter = ({ interests }) => {
    const [categories, setCategories] = useState([]);

    // Loop to fill the multiselect options
    useEffect(() => {
        let newArray = [];
        interests['interests_choices'].map(element => {
            // React Select needs to receive an object with value/label properties
            newArray.push({
                value: element,
                label: element
            });
            setCategories(newArray);
        });
    }, [])

    console.log(categories);
    return (
        <div>
            {
                <Select 
                    isMulti 
                    options={categories}
                />
            }
        </div>
    );
};

export default MultiSelectFilter;

MultiSelectFilter.propTypes = {
    interests: PropTypes.object.isRequired,
}
