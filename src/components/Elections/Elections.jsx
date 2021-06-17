import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import hoverResults from './data/regions.csv';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

export default () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(2.213749);
    const [lat] = useState(46.227638);
    const [zoom] = useState(6);
    const [csvData, setCsvData] = useState();

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/larem/ckps60m1405ic17qb2olzlahx',
            center: [lng, lat],
            zoom,
        });

        Papa.parse(hoverResults, {
            delimiter: ',',
            download: true,
            header: true,
            skipEmptyLines: true,
            complete(results) {
                setCsvData(results);
            },
        });
    }, []);

    useEffect(() => {
        if (csvData !== undefined) {
            map.current.on('load', () => {
                console.log(csvData);
                csvData.data.forEach((row) => {
                    map.current.setFeatureState({
                        source: 'larem.dgdcc9o1',
                        sourceLayer: 'larem.dgdcc9o1',
                        id: row.region,
                    });
                });
            });
        }
    }, [csvData]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};
