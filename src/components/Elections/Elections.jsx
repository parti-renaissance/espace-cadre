import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

export default () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(2.213749);
    const [lat, setLat] = useState(46.227638);
    const [zoom, setZoom] = useState(4);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom,
        });
    });

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};
