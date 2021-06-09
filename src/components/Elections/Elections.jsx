import React, { useState } from 'react';
import {
    MapContainer, TileLayer, GeoJSON, LayersControl,
} from 'react-leaflet';
import ListOfElections from './components/ListOfElections';
import coordinates from './data/departements_v3.json';
import Spinner from '../Spinner/Spinner';

const Elections = () => {
    const [geoData] = useState(coordinates.features);
    const center = [46.227638, 2.213749];

    return (
        <>
            {geoData.length > 0 ? (
                <MapContainer
                    center={center}
                    zoom="5"
                    className="leaflet-container-polygone"
                >
                    <LayersControl position="topright">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                        />
                        <LayersControl.Overlay checked name="Européennes 2014">
                            <GeoJSON
                                data={geoData}
                                onEachFeature={ListOfElections.europeennes2014}
                                style={{
                                    weight: '0.3',
                                }}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Départementales 2015">
                            <GeoJSON
                                data={geoData}
                                onEachFeature={ListOfElections.departementales2015}
                                style={{
                                    color: 'red',
                                    weight: '0.3',
                                }}
                            />
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            ) : <Spinner />}
        </>
    );
};

export default Elections;
