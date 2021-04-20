import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { apiClientProxy } from '../../../services/networking/client';

// A multiselect dropdown
const MultiSelectFilter = () => {
    const [categories, setCategories] = useState([]);
    try {
        useEffect(() => {
            const categoriesTitle = async () => {
                const newArray = [];
                const body = await apiClientProxy.get('/contacts');
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
            <Select
                isMulti
                options={categories}
            />
        </div>
    );
};

export default MultiSelectFilter;
