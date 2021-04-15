import React, { useState, useEffect, useMemo } from 'react';

import Spinner from '../Spinner/Spinner';
import TableContainer from './TableContainer/TableContainer';

import ColumnFilter from './Filters/ColumnFilter';
import SelectFilter from './Filters/SelectFilter';
import MultiSelectFilter from './Filters/MultiSelectFilter';


const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);

    // Get the data for the table
    useEffect(() => {
        const getContactsAndColumnsTitles = async () => {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch('https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts');

                const body = await response.json();
                const columnsTitle = (Object.keys(body[0]));
                const columns = columnsTitle.map((title) => {
                    const cleanTitle = title.replace('_', ' ');
                    // Display a specific filter depending of the column
                    const typeOfFilter = () => {
                        if (title === "id") {
                            return "";
                        } else if (title === 'Genre') {
                            return SelectFilter;
                        } else if (title === "Centres_d'intérêt") {
                            return <MultiSelectFilter />
                        } else {
                            return ColumnFilter
                        }
                    }
                    let typeOfCell = () => {
                        // eslint-disable-next-line react/prop-types
                        return (props) => props.value || "";
                    }
                    if (title === "Centres_d'intérêt") {
                        typeOfCell = () => {
                            return (props) => {
                                // eslint-disable-next-line react/prop-types
                                return props.value.map((el, index) => (
                                    <>
                                        <div key={index} className="badge badge-info">
                                            {el}
                                        </div> {' '}
                                    </>)
                                )
                            }
                        };
                    } else if (title === "Abonné_tel") {
                        typeOfCell = () => {
                            return (props) => {
                                // eslint-disable-next-line react/prop-types
                                if(props.value) {
                                // eslint-disable-next-line react/prop-types
                                    console.log(props.value)
                                    return <input type="checkbox" checked readOnly/>;
                                } else {
                                    return  <input type="checkbox" readOnly/>
                                }
                            }
                        };
                    }

                    else if (title === "Abonné_email") {
                        typeOfCell = () => {
                            return (props) => {
                                // eslint-disable-next-line react/prop-types
                                if(props.value) {
                                // eslint-disable-next-line react/prop-types
                                    console.log(props.value)
                                    return <input type="checkbox" checked readOnly/>;
                                } else {
                                    return  <input type="checkbox" readOnly/>
                                }
                            }
                        };
                    }

                    return {
                        Header: cleanTitle,
                        accessor: title,
                        Filter: typeOfFilter(),
                        Cell: typeOfCell()
                    };
                });
                
                setColumnsTitle(columns);
                setData(body);
                setLoading(false);
            } catch (error) {
                setError(true);
            }
        };
        getContactsAndColumnsTitles();
    }, []);
    
    // Set the search input to every column
    const defaultColumn = useMemo(() => ({
        Filter: ColumnFilter,
    }), []);

    // Handle error on fetch, async loading with spinner and rendering when loaded
    const content = () => {
        if (error) {
            return <div className="alert alert-danger w-50" role="alert">Erreur dans le chargement de la page</div>

        } else if (loading && !error) {
            return <Spinner />
        } else if (!loading && !error) {
            return < TableContainer
                columns={columnsTitle}
                data={data}
                defaultColumn={defaultColumn}
            />
        }
    };

    return (
        <div>
            {content()}
        </div>
    );
};

export default Contacts;
