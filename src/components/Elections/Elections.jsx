import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import departements from './data/departements_v4.json';
import arrondissementParis from './data/paris_arrondissements.json';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

export default () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(2.213749);
    const [lat] = useState(46.227638);
    const [zoom] = useState(5);
    const [departementsData] = useState(departements);
    const [arrondissementsData] = useState(arrondissementParis);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom,
        });

        map.current.on('load', () => {
            map.current.addSource('france', {
                type: 'geojson',
                data: departementsData,
            });

            // Départements
            map.current.addLayer({
                id: 'france',
                type: 'fill',
                source: 'france',
                layout: {},
                paint: {
                    'fill-color': '#0080ff',
                    'fill-opacity': 0.5,
                },
            });

            map.current.addLayer({
                id: 'outline',
                type: 'line',
                source: 'france',
                layout: {},
                paint: {
                    'line-color': '#F0F1F3',
                    'line-width': 0.5,
                },
            });
        });

        map.current.on('load', () => {
            // Arrondissements
            map.current.addSource('arrondissements', {
                type: 'geojson',
                data: arrondissementsData,
            });

            map.current.addLayer({
                id: 'arrondissements',
                type: 'fill',
                source: 'arrondissements',
                layout: {},
                paint: {
                    'fill-color': '#0080ff',
                    'fill-opacity': 0.5,
                },
            });

            map.current.addLayer({
                id: 'outline2',
                type: 'line',
                source: 'arrondissements',
                layout: {},
                paint: {
                    'line-color': '#F0F1F3',
                    'line-width': 0.5,
                },
            });
        });
    });

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};
