import React from 'react';
import {
    MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';

function MapComponent({ mapData }) {
    L.Icon.Default.imagePath = 'images/';
    const count = mapData.survey_datas.length;
    return (
        <div className="with-background dc-container w-100">
            <div className="row p-3">
                <span className="count-bubble ml-3">{count}</span>
                <div className="col pl-0">
                    <div className="chart-title">Questionnaires remplis</div>
                    <div className="chart-subtitle">Répartition géographique dans votre région</div>
                </div>
            </div>
            <MapContainer
                center={[mapData.latitude, mapData.longitude]}
                zoom={8}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                />

                {mapData.survey_datas.map((data) => (
                    <Marker key={data.id} position={[data.latitude, data.longitude]}>
                        <Popup>
                            <strong>Nom du sondage:</strong> {data.survey.name} <br />
                            <strong>Répondu le:</strong> {data.posted_at}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default MapComponent;

MapComponent.propTypes = {
    mapData: PropTypes.shape({
        zone_name: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        survey_datas: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};
