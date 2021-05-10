import React from 'react';
import {
    MapContainer, TileLayer, Marker,
} from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';

function MapComponent({ mapData }) {
    L.Icon.Default.imagePath = 'images/';
    return (
        <MapContainer
            center={[48.893051, 2.350518]}
            zoom={5}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            {mapData.map((data) => (
                <Marker key={data.id} position={[data.latitude, data.longitude]} />
            ))}
        </MapContainer>
    );
}

export default MapComponent;

MapComponent.propTypes = {
    mapData: PropTypes.arrayOf(Object).isRequired,
};
