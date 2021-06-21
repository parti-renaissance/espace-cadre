/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import regions from './data/regions.csv';
import departements from './data/departements.csv';
import cantons from './data/cantons.csv';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

const LAYER_REGION = 'regions';
const LAYER_DEPARTMENT = 'departements';
const LAYER_CANTONS = 'cantons';
const LAYERS_TYPES = [
    {
        code: LAYER_REGION,
        label: 'Régions',
    },
    {
        code: LAYER_DEPARTMENT,
        label: 'Départements',
    },
    {
        code: LAYER_CANTONS,
        label: 'Cantons',
    },
];
const ELECTION_TYPE_PRESIDENTIALS = 'Présidentielles';
const ELECTION_TYPE_DEPARTMENTALS = 'Départementales';
const ELECTION_TYPE_LEGISLATIVES = 'Législatives';
const ELECTION_TYPE_EUROPEANS = 'Européennes';
const ELECTIONS_TYPES = [
    {
        code: ELECTION_TYPE_PRESIDENTIALS,
        label: 'Présidentielles',
    },
    {
        code: ELECTION_TYPE_DEPARTMENTALS,
        label: 'Départementales',
    },
    {
        code: ELECTION_TYPE_LEGISLATIVES,
        label: 'Législatives',
    },
    {
        code: ELECTION_TYPE_EUROPEANS,
        label: 'Européennes',
    },
];
const FIRST_ROUND = '1er tour';
const SECOND_ROUND = '2e tour';
const ROUNDS = [
    {
        code: FIRST_ROUND,
        label: '1er tour',
    },
    {
        code: SECOND_ROUND,
        label: '2e tour',
    },
];

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [regionsCsv, setRegionsCsv] = useState();
    const [departementsCsv, setDepartementsCsv] = useState();
    const [cantonsCsv, setCantonsCsv] = useState();
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [electionType, setElectionType] = useState(ELECTION_TYPE_PRESIDENTIALS);
    const [roundInfo, setRoundInfo] = useState(FIRST_ROUND);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        // Display the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/larem/ckps60m1405ic17qb2olzlahx',
            center: [2.213749, 46.227638],
            zoom: 5,
        });
    }, []);

    // Wait for the map to be loaded and display layer visibility to none
    useEffect(() => {
        map.current.on('load', () => {
            setMapLoaded(true);
            LAYERS_TYPES.map((el) => map.current.setLayoutProperty(el.code, 'visibility', 'none'));
        });
    }, [map]);

    // Once the map is loaded, set region as default layer and prepare csv data
    useEffect(() => {
        if (mapLoaded) {
            map.current.setLayoutProperty(activeLayer, 'visibility', 'visible');

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

            // Convert cantons csv to JSON
            Papa.parse(cantons, {
                delimiter: ',',
                download: true,
                header: true,
                skipEmptyLines: true,
                complete(results) {
                    setCantonsCsv(results);
                },
            });
        }
    }, [activeLayer, mapLoaded]);

    // Display region on the map
    useEffect(() => {
        if (regionsCsv !== undefined) {
            const popup = new mapboxgl.Popup();

            map.current.on('click', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                // Get the region layer from mapbox
                const regionsFromMapbox = map.current.queryRenderedFeatures(e.point, {
                    layers: ['regions'],
                });
                const props = regionsFromMapbox[0];
                if (props !== undefined) {
                    // Get all data for the selected layer
                    // eslint-disable-next-line react/prop-types
                    const data = regionsCsv.data.filter((el) => (el.region === props.properties.code));
                    // Get all data for the selected election type
                    popup
                        .setLngLat(e.lngLat)
                        .setHTML(data
                            .filter((val) => val.election === electionType && val.tour === roundInfo.charAt(0))
                            .map((el) => `
                                <table class="table elections-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Election
                                            </th>
                                            <th scope="col">
                                                Année
                                            </th>
                                            <th scope="col">
                                                Liste
                                            </th>
                                            <th scope="col">
                                                Tour
                                            </th>
                                            <th scope="col">
                                                Voix
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${el.election}</td>
                                            <td>${el.annee}</td>
                                            <td>${el.nom_liste}</td>
                                            <td>${el.tour}</td>
                                            <td>${el.voix}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            `))
                        .addTo(map.current);
                }
            });
        }
    }, [regionsCsv, electionType, roundInfo]);

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
                        .setHTML(data
                            .filter((val) => val.election === electionType && val.tour === roundInfo.charAt(0))
                            .map((el) => (
                                `
                                <table class="table elections-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Election
                                            </th>
                                            <th scope="col">
                                                Année
                                            </th>
                                            <th scope="col">
                                               Liste
                                            </th>
                                            <th scope="col">
                                                Tour
                                            </th>
                                            <th scope="col">
                                                Voix
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${el.election}</td>
                                            <td>${el.annee}</td>
                                            <td>${el.nom_liste}</td>
                                            <td>${el.tour}</td>
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
    }, [departementsCsv, electionType, roundInfo]);

    // Display cantons on the map
    useEffect(() => {
        if (cantonsCsv !== undefined) {
            const popup = new mapboxgl.Popup();

            map.current.on('click', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                const cantonsFromMapbox = map.current.queryRenderedFeatures(e.point, {
                    layers: ['cantons'],
                });
                const props = cantonsFromMapbox[0];
                if (props !== undefined) {
                    // eslint-disable-next-line react/prop-types
                    const data = cantonsCsv.data.filter((el) => (el.code_canton === props.properties.code));
                    popup
                        .setLngLat(e.lngLat)
                        .setHTML(data
                            .filter((val) => val.election === electionType && val.tour === roundInfo.charAt(0))
                            .map((el) => (
                                `
                                <table class="table elections-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Election
                                            </th>
                                            <th scope="col">
                                                Année
                                            </th>
                                            <th scope="col">
                                                Liste
                                            </th>
                                            <th scope="col">
                                                Tour
                                            </th>
                                            <th scope="col">
                                                Voix
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${el.election}</td>
                                            <td>${el.annee}</td>
                                            <td>${el.nom_liste}</td>
                                            <td>${el.tour}</td>
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
    }, [cantonsCsv, electionType, roundInfo]);

    /* ******************
    * FILTERS
    ****************** */
    // Handle the behaviour for the layer select
    const handleLayer = (e) => {
        if (e.target.value === 'regions') {
            setActiveLayer(LAYER_REGION);
            map.current.setLayoutProperty(LAYER_DEPARTMENT, 'visibility', 'none');
            map.current.setLayoutProperty(LAYER_CANTONS, 'visibility', 'none');
        } else if (e.target.value === 'departements') {
            setActiveLayer(LAYER_DEPARTMENT);
            map.current.setLayoutProperty(LAYER_REGION, 'visibility', 'none');
            map.current.setLayoutProperty(LAYER_CANTONS, 'visibility', 'none');
        } else if (e.target.value === 'cantons') {
            setActiveLayer(LAYER_CANTONS);
            map.current.setLayoutProperty(LAYER_DEPARTMENT, 'visibility', 'none');
            map.current.setLayoutProperty(LAYER_REGION, 'visibility', 'none');
        }
    };

    return (
        <div>
            <select className="mb-3 mr-3" onChange={handleLayer}>
                {LAYERS_TYPES.map((layer, i) => <option key={i + 1} value={layer.code}>{layer.label}</option>)}
            </select>
            <select className="mr-3" onChange={(e) => setElectionType(e.target.value)}>
                {ELECTIONS_TYPES.map((election, i) => (
                    <option key={i + 1} value={election.code}>
                        {election.label}
                    </option>
                ))}
            </select>
            <select onChange={(e) => setRoundInfo(e.target.value)}>
                {ROUNDS.map((round, i) => <option key={i + 1} value={round.code}> {round.label}</option>)}

            </select>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default Elections;
