/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import regions from './data/regions.csv';
import departements from './data/departements.csv';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

const LAYER_REGION = 'regions';
const LAYER_DEPARTMENT = 'departements';

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(2.213749);
    const [lat] = useState(46.227638);
    const [zoom] = useState(5);
    const [regionsCsv, setRegionsCsv] = useState();
    const [departementsCsv, setDepartementsCsv] = useState();
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const layers = ['Régions', 'Départements'];

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
                setRegionsCsv(results);
            },
        });

        // Convert departements csv to JSON
        Papa.parse(departements, {
            delimiter: ',',
            download: true,
            header: true,
            skipEmptyLines: true,
            complete(results) {
                setDepartementsCsv(results);
            },
        });
    }, []);

    // Wait for the map to be loaded and display layer visibility to none
    useEffect(() => {
        map.current.on('load', () => {
            setMapLoaded(true);
            map.current.setLayoutProperty(LAYER_REGION, 'visibility', 'none');
            map.current.setLayoutProperty(LAYER_DEPARTMENT, 'visibility', 'none');
        });
    }, [map]);

    // Once the map is loaded, set region as default layer
    useEffect(() => {
        if (mapLoaded) {
            map.current.setLayoutProperty(activeLayer, 'visibility', 'visible');
        }
    }, [activeLayer, mapLoaded]);

    // Display region on the map
    useEffect(() => {
        if (regionsCsv !== undefined) {
            const popup = new mapboxgl.Popup();

            map.current.on('click', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                const regionsFromMapbox = map.current.queryRenderedFeatures(e.point, {
                    layers: ['regions'],
                });

                const props = regionsFromMapbox[0];
                if (props !== undefined) {
                    // eslint-disable-next-line react/prop-types
                    const data = regionsCsv.data.filter((el) => (el.region === props.properties.code));
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
                }
            });
        }
    }, [regionsCsv]);

    // Display departements on the map
    useEffect(() => {
        if (departementsCsv !== undefined) {
            const popup = new mapboxgl.Popup();

            map.current.on('click', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                const departementsFromMapbox = map.current.queryRenderedFeatures(e.point, {
                    layers: ['departements'],
                });
                const props = departementsFromMapbox[0];
                if (props !== undefined) {
                    // eslint-disable-next-line react/prop-types
                    const data = departementsCsv.data.filter((el) => (el.departement === props.properties.code));
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
                        )))
                        .addTo(map.current);
                }
            });
        }
    }, [departementsCsv]);

    const handleChange = (e) => {
        if (e.target.value === 'Régions') {
            setActiveLayer(LAYER_REGION);
            map.current.setLayoutProperty(LAYER_DEPARTMENT, 'visibility', 'none');
        } else if (e.target.value === 'Départements') {
            setActiveLayer(LAYER_DEPARTMENT);
            map.current.setLayoutProperty(LAYER_REGION, 'visibility', 'none');
        }
    };
    return (
        <div>
            <select className="mb-3" onChange={handleChange}>
                {layers.map((layer, i) => <option key={i + 1} value={layer}>{layer}</option>)}
            </select>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default Elections;
