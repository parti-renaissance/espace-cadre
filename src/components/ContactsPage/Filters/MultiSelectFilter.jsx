import React, { useState } from "react";
import MultiSelect from "react-multi-select-component";

// A multiselect dropdown
const MultiSelectFilter = () => {
    // Todo: make it dynamic
    const options = [
        { label: "Éducation", value: "Éducation" },
        { label: "Ruralité", value: "Ruralité" },
        { label: "Solidarités", value: "Solidarités"},
        { label: "Numérique", value: "Numérique" },
        { label: "Santé", value: "Santé" },
        { label: "République", value: "République" },
        { label: "Égalité F/H", value: "Égalité F/H" },
        { label: "Villes et quartiers", value: "Villes et quartiers" },
        { label: "Europe", value: "Europe" },
        { label: "Puissance publique", value: "Puissance publique" },
        { label: "Inclusion", value: "Inclusion" },
        { label: "Économie", value: "Économie" },
        { label: "Sécurité et Défense", value: "Sécurité et Défense" },
        { label: "Démocratie", value: "Démocratie" },
        { label: "Transition écologique", value: "Transition écologique" },
        { label: "International", value: "International" },
        { label: "Travail", value: "Travail" },
        { label: "Justice", value: "Justice" },
        { label: "Culture", value: "Culture" },
        { label: "LGBT+", value: "LGBT+" },
        { label: "Familles", value: "Familles" },
    ];

    const [selected, setSelected] = useState([]);

    return (
        <div>
            <MultiSelect
                options={options}
                value={selected}
                onChange={setSelected}
                hasSelectAll={false}
                disableSearch={true}
            />
        </div>
    );
};

export default MultiSelectFilter;