import React, { useState, useEffect } from 'react';
import {
    MapContainer, Polygon, TileLayer,
} from 'react-leaflet';
import coordinates from './data';
import Spinner from '../Spinner/Spinner';

const Polygone = () => {
    const [geoData, setgeoData] = useState([]);
    const center = [48.82696415356696, 2.354985884885468];

    const correctGeoFormat = (dataToConvert) => {
        const fetchedData = [];
        (dataToConvert.map((el) => el.map((data) => fetchedData.push(data.reverse()))));
        setgeoData(fetchedData);
    };

    useEffect(() => {
        correctGeoFormat(coordinates);
    }, []);

    return (
        <>
            {geoData.length > 0 ? (
                <MapContainer
                    center={center}
                    zoom="12"
                    className="leaflet-container-polygone"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />
                    <Polygon pathOptions={{ color: '#0049C6' }} positions={geoData} />
                </MapContainer>
            ) : <Spinner />}
        </>
    );
};

export default Polygone;
