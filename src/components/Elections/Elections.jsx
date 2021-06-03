import React, { useState } from 'react';
import {
    MapContainer, Polygon, TileLayer, LayersControl, FeatureGroup,
} from 'react-leaflet';
import coordinates from './data.json';
import Spinner from '../Spinner/Spinner';

const Elections = () => {
    const [geoData] = useState(coordinates.features);
    const center = [48.863344411573, 2.3508413205563];

    return (
        <>
            {geoData.length > 0 ? (
                <MapContainer
                    center={center}
                    zoom="11"
                    className="leaflet-container-polygone"
                >
                    <LayersControl position="topright">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                        />
                        <LayersControl.Overlay checked name="Présidentielles 2017">
                            <FeatureGroup>
                                {geoData.map((departement) => (
                                    <Polygon
                                        key={departement.properties.nom}
                                        pathOptions={{ color: '#0049C6', weight: '0.5' }}
                                        positions={departement.geometry.coordinates}
                                    />
                                ))}
                            </FeatureGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Présidentielles 2021">
                            <FeatureGroup>
                                {geoData.map((departement) => (
                                    <Polygon
                                        key={departement.properties.nom}
                                        pathOptions={{ color: 'red', weight: '0.5' }}
                                        positions={departement.geometry.coordinates}
                                    />
                                ))}
                            </FeatureGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            ) : <Spinner />}
        </>
    );
};

export default Elections;
