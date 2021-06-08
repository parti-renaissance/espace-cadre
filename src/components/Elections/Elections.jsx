import React, { useState } from 'react';
import {
    MapContainer, TileLayer, GeoJSON,
} from 'react-leaflet';
import coordinates from './data2.json';
import Spinner from '../Spinner/Spinner';

const Elections = () => {
    const [geoData] = useState(coordinates.features);
    const center = [48.863344411573, 2.3508413205563];

    const onEachFeature = (feature, layer) => {
        const tooltip = `${feature.properties.nom}`;
        layer.bindPopup(tooltip);
    };

    return (
        <>
            {geoData.length > 0 ? (
                <MapContainer
                    center={center}
                    zoom="7"
                    className="leaflet-container-polygone"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />
                    <GeoJSON data={geoData} onEachFeature={onEachFeature} />
                </MapContainer>
            ) : <Spinner />}
        </>
    );
};

export default Elections;
