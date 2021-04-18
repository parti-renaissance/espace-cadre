import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// A multiselect dropdown
const MultiSelectFilter = () => {
    const [categories, setCategories] = useState([]);
    try {
        useEffect(() => {
            const categoriesTitle = async () => {
                const newArray = [];
                const response = await fetch('https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts');
                const body = await response.json();
                body.interests_choices.forEach((element) => {
                    newArray.push({
                        value: element,
                        label: element,
                    });
                    setCategories(newArray);
                });
            };
            categoriesTitle();
        }, []);
    } catch (error) {
        console.error(error);
    }

    return (
        <div>
            <Select isMulti options={categories} />
        </div>
    );
};

export default MultiSelectFilter;
