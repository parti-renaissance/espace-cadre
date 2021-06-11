import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

export default () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(2.213749);
    const [lat] = useState(46.227638);
    const [zoom] = useState(6);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/larem/ckps60m1405ic17qb2olzlahx',
            center: [lng, lat],
            zoom,
        });

        map.current.on('load', () => {
            map.current.on('mousemove', (e) => {
                const departementsFromMapbox = map.current.queryRenderedFeatures(e.point, {
                    layers: ['departementsdata'],
                });

                if (departementsFromMapbox.length > 0) {
                    document.getElementById('pd').innerHTML = `<div>${departementsFromMapbox[0].properties.elections} infos</div>`;
                } else {
                    document.getElementById('pd').innerHTML = '<div>Survolez la carte pour afficher des informations</div>';
                }
            });
        });
    });
    return (
        <div>
            <div ref={mapContainer} className="map-container" />
            <div className="map-overlay" id="features"><h2>Cartes des élections</h2><div id="pd"><p>Survolez la carte</p></div></div>
        </div>
    );
};
