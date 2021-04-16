import React, { useEffect } from "react";
import Select from 'react-select'


// A multiselect dropdown
const MultiSelectFilter = () => {
    //const [categories, setCategories] = useState([]);
    try {
        useEffect(() => {
            const categoriesTitle = async () => {
                const response = await fetch('https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts');
                const body = await response.json();
                body.map(element => {
                    let newArray = element;
                    console.log(newArray['Centres_d\'intérêt']);
                });
            }
            categoriesTitle();

            /*const Array = () => {
                let newArray = [];
                categories.map(el => {
                    newArray.push({
                        value: el,
                        label: el
                    })
                })
                setOptions(newArray);
            };
            Array();*/

        }, []);

    } catch(error) {
        console.error(error);
    }

    return (
        <div>
            {
                <Select isMulti /*options={categories}*//>
            }
        </div>
    );
};

export default MultiSelectFilter;
