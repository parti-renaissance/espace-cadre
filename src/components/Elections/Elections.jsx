import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import regions from './data/regions.csv';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(2.213749);
    const [lat] = useState(46.227638);
    const [zoom] = useState(5);
    const [csvData, setCsvData] = useState();

    useEffect(() => {
        if (map.current) return; // initialize map only once
        // Display the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/larem/ckps60m1405ic17qb2olzlahx',
            center: [lng, lat],
            zoom,
        });

        // Convert region csv to JSON
        Papa.parse(regions, {
            delimiter: ',',
            download: true,
            header: true,
            skipEmptyLines: true,
            complete(results) {
                setCsvData(results);
            },
        });
    }, []);

    // Display region on the map
    useEffect(() => {
        if (csvData !== undefined) {
            map.current.on('load', () => {
                const popup = new mapboxgl.Popup();

                map.current.on('click', (e) => {
                    map.current.getCanvas().style.cursor = 'pointer';
                    const regionsFromMapbox = map.current.queryRenderedFeatures(e.point, {
                        layers: ['regions'],
                    });
                    const props = regionsFromMapbox[0];
                    console.log('csv', csvData);
                    console.log('props', props);
                    // eslint-disable-next-line react/prop-types
                    const data = csvData.data.filter((el) => (el.region === props.properties.code));
                    popup
                        .setLngLat(e.lngLat)
                        .setHTML(data.map((el) => (
                            `
                                <table class="table table-stripe">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Année
                                            </th>
                                            <th scope="col">
                                                Nom de la liste
                                            </th>
                                            <th scope="col">
                                                Tour
                                            </th>
                                            <th scope="col">
                                                votants
                                            </th>
                                            <th scope="col">
                                            Voix
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${el.annee}</td>
                                            <td>${el.nom_liste}</td>
                                            <td>${el.tour}</td>
                                            <td>${el.votants}</td>
                                            <td>${el.voix}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            `
                        ))).addTo(map.current);
                });
            });
        }
    }, [csvData]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default Elections;
