import React, { useState } from 'react';
import {
    MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import * as fakeData from './data.json';

function MapComponent() {
    const [markerData] = useState(fakeData.default);
    return (
        <MapContainer
            center={[48.856613, 2.352222]}
            zoom={16}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            {markerData.map((data) => (
                <Marker key={data.recordid} position={[data.fields.coordonnees_geo[0], data.fields.coordonnees_geo[1]]}>
                    <Popup>
                        <strong>Nom:</strong> {data.fields.name} <br />
                        <strong>Nombre de vélos disponible:</strong> {data.fields.numbikesavailable}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapComponent;
