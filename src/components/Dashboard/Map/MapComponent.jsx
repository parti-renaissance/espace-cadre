import React from 'react';
import {
    MapContainer, TileLayer, Marker, Popup,
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
                <Marker key={data.id} position={[data.latitude, data.longitude]}>
                    <Popup>
                        <strong>Nom du sondage:</strong> {data.jecoute_survey.name} <br />
                        <strong>Nom du répondant:</strong> {data.jecoute_survey.author_id} <br />
                        <strong>Répondu le:</strong> {data.jecoute_survey.created_at}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapComponent;

MapComponent.propTypes = {
    mapData: PropTypes.arrayOf(Object).isRequired,
};
