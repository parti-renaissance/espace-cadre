import React, { useState } from 'react';
import {
    MapContainer, Polygon, TileLayer,
} from 'react-leaflet';
import coordinates from './data.json';
import Spinner from '../Spinner/Spinner';

const Polygone = () => {
    const [geoData] = useState(coordinates.features);
    const center = [48.863344411573, 2.3508413205563];

    return (
        <>
            {geoData.length > 0 ? (
                <MapContainer
                    center={center}
                    zoom="13"
                    className="leaflet-container-polygone"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />
                    {geoData.map((departement) => (
                        <Polygon
                            key={departement.properties.nom}
                            pathOptions={{ color: '#0049C6', weight: '0.5' }}
                            positions={departement.geometry.coordinates}
                        />
                    ))}
                </MapContainer>
            ) : <Spinner />}
        </>
    );
};

export default Polygone;
