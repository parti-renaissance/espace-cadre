import React, { useState } from 'react';
import {
    MapContainer, TileLayer, GeoJSON, LayersControl,
} from 'react-leaflet';
import coordinates from './departements_v3.json';
import Spinner from '../Spinner/Spinner';

const Elections = () => {
    const [geoData] = useState(coordinates.features);
    const center = [46.227638, 2.213749];

    const departementales2015 = (feature, layer) => {
        const resultats1 = feature.properties.elections[0].resultats.map(
            (el) => `${el.nuance}: ${el.voix} voix<br>`,
        );
        const resultats2 = feature.properties.elections[1].resultats.map(
            (el) => `${el.nuance}: ${el.voix} voix<br>`,
        );

        const tooltip = `
            <strong>${feature.properties.nom} > ${feature.properties.elections[0].election}</strong><br><br>
            <strong>1er tour:</strong><br>
            Voix exprimés:  ${feature.properties.elections[0].exprimes}<br>
            Nombre d'inscrits: ${feature.properties.elections[0].inscrits}<br>
            Nombre de votants: ${feature.properties.elections[0].votants}<br>
            Résultats:<br>${resultats1}<br><br>
            <strong>2e tour:</strong><br>
            Voix exprimés:  ${feature.properties.elections[1].exprimes}<br>
            Nombre d'inscrits: ${feature.properties.elections[1].inscrits}<br>
            Nombre de votants: ${feature.properties.elections[1].votants}<br>
            Résultats:<br>${resultats2}
        `;
        layer.bindPopup(tooltip);
    };

    const européennes2014 = (feature, layer) => {
        const resultats3 = feature.properties.elections[2].resultats.map(
            (el) => `${el.nuance}: ${el.voix} voix<br>`,
        );

        const tooltip = `
        ${feature.properties.nom} > ${feature.properties.elections[2].election}<br><br>
        Voix exprimés:  ${feature.properties.elections[2].exprimes}<br>
        Nombre d'inscrits: ${feature.properties.elections[2].inscrits}<br>
        Nombre de votants: ${feature.properties.elections[2].votants}<br>
        Résultats:<br> ${resultats3}
        `;
        layer.bindPopup(tooltip);
    };

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
                        <LayersControl.Overlay name="Européennes 2014">
                            <GeoJSON
                                data={geoData}
                                onEachFeature={européennes2014}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay checked name="Départementales 2015">
                            <GeoJSON
                                data={geoData}
                                onEachFeature={departementales2015}
                            />
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            ) : <Spinner />}
        </>
    );
};

export default Elections;
