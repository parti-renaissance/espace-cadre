/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Papa from 'papaparse';
import $ from 'jquery';
import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import regions from './data/regions_v7.csv';
import departements from './data/departements_v7.csv';
import cantons from './data/cantons_v7.csv';
import circonscriptions from './data/circonscriptions_v7.csv';
import ElectionModal from './ElectionModal';
import LayerFilter from './Filter/LayerFilter';
import ElectionTypeFilter from './Filter/ElectionTypeFilter';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2twcW9wYWp6MW54MDJwcXF4em1ieWh3eSJ9.LxKs_dipHMNZ-JdTkyKEMQ';

const LAYER_REGION = 'regions';
const LAYER_DEPARTMENT = 'departements';
const LAYER_CANTONS = 'cantons';
const LAYER_CIRCONSCRIPTIONS = 'circonscriptions';
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
    {
        code: LAYER_CIRCONSCRIPTIONS,
        label: 'Circonscriptions',
    },
];
const ELECTION_TYPE_PRESIDENTIAL = 'presidential';
const ELECTION_TYPE_DEPARTMENTAL = 'departmental';
const ELECTION_TYPE_LEGISLATIVE = 'legislative';
const ELECTION_TYPE_REGIONAL = 'regional';
const ELECTION_TYPE_EUROPEANS = 'Européennes';

const ELECTION_LABELS = {};
ELECTION_LABELS[ELECTION_TYPE_PRESIDENTIAL] = 'Présidentielles';
ELECTION_LABELS[ELECTION_TYPE_DEPARTMENTAL] = 'Départementales';
ELECTION_LABELS[ELECTION_TYPE_LEGISLATIVE] = 'Législatives';
ELECTION_LABELS[ELECTION_TYPE_REGIONAL] = 'Régionales';
ELECTION_LABELS[ELECTION_TYPE_EUROPEANS] = 'Européennes';

const ELECTION_ROUND_FIRST = '1';
const ELECTION_ROUND_SECOND = '2';

const ELECTION_ROUND_LABELS = {};
ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST] = '1er tour';
ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND] = '2e tour';

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [regionsCsv, setRegionsCsv] = useState();
    const [departmentCsv, setDepartmentsCsv] = useState();
    const [cantonsCsv, setCantonsCsv] = useState();
    const [circonscriptionsCsv, setCirconscriptionsCsv] = useState();
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPoint, setCurrentPoint] = useState();
    const [electionData, setElectionData] = useState({});
    const [filterValues, setFilterValues] = useState({
        electionType: ELECTION_TYPE_PRESIDENTIAL,
        electionRound: ELECTION_ROUND_FIRST,
        electionYear: '2017',
    });

    const findZoneData = (code) => {
        let dataCsv;
        let filter;

        switch (activeLayer) {
        case LAYER_DEPARTMENT:
            dataCsv = departmentCsv;
            filter = (element) => element.departement === code;
            break;
        case LAYER_CANTONS:
            dataCsv = cantonsCsv;
            filter = (element) => element.codeCanton === code;
            break;
        case LAYER_CIRCONSCRIPTIONS:
            dataCsv = circonscriptionsCsv;
            filter = (element) => element.codeCirco === code;
            break;
        default:
            dataCsv = regionsCsv;
            filter = (element) => element.region === code;
            break;
        }

        const electionType = ELECTION_LABELS[filterValues.electionType];

        return dataCsv.data.filter(
            (element) => filter(element)
                && element.election === electionType
                && element.annee === filterValues.electionYear
                && element.tour === filterValues.electionRound,
        );
    };

    // Display only the choosen layer
    const switchLayer = () => {
        LAYERS_TYPES.map((el) => map.current.setLayoutProperty(el.code, 'visibility', el.code === activeLayer ? 'visible' : 'none'));
    };

    // Get all differents elections which are in csv files
    const updateElectionData = (layer, data) => {
        const keys = [];
        data.forEach((item) => {
            keys.push(`${item.election}|${item.annee}|${item.tour}`);
        });

        setElectionData((state) => {
            state[layer] = _.uniq(keys);
            return state;
        });
    };

    useEffect(() => {
        if (map.current) return; // initialize map only once
        // Display the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/larem/ckq7vwlpl8ott17n6jol1mvhd',
            center: [2.213749, 46.227638],
            zoom: 5,
        });
    }, []);

    // Wait for the map to be loaded and display layer visibility to none
    useEffect(() => {
        map.current.getCanvas().style.cursor = 'pointer';

        map.current.on('load', () => setMapLoaded(true));
        map.current.on('click', (event) => {
            setCurrentPoint({ point: event.point, lngLat: event.lngLat });
        });

        // Close the modal on click
        $('#map-overlay').on('click', '#close-modal', () => {
            $('#map-overlay').empty();
        });
    }, [map]);

    useEffect(() => {
        if (!currentPoint || !mapLoaded) {
            return;
        }

        const propsFromMapbox = map.current.queryRenderedFeatures(currentPoint.point, { layers: [activeLayer] });

        if (!Array.isArray(propsFromMapbox) || !propsFromMapbox.length) {
            return;
        }
        const data = findZoneData(propsFromMapbox[0].properties.code);

        const modalContent = document.getElementById('map-overlay');

        if (data.length) {
            modalContent.innerHTML = `
                <div class="elections-area">${data[0].nom}</div>
                <div class="election-name">${data[0].election} ${data[0].annee}</div>
                <div id="close-modal">x</div>
                <div class="flash-info">
                    <div class="flash-div"><span class="flash-span">${data[0].inscrits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} inscrits</span></div>
                    <div class="flash-div">Taux de participation: <span class="flash-span">${data[0].participationPourcent}%</span></div>
                    <div class="flash-div">Votes blancs ou nuls: <span class="flash-span">${data[0].blancsNulsPourcent}%</span></div>
                </div>
                <div>
                    ${renderToString(data.sort((a, b) => b.voix - a.voix).map((element, i) => <ElectionModal key={i + 1} row={element} />))}
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div id="close-modal">x</div>
                <div class="no-data">
                    <div class="flash-div"><span class="flash-span">Sélectionnez une élection</span></div>
                </div>
            `;
        }
    }, [currentPoint]);

    useEffect(() => mapLoaded && switchLayer(), [mapLoaded, activeLayer]);

    // Once the map is loaded, set region as default layer and prepare csv data
    useEffect(() => {
        if (mapLoaded) {
            // Convert region csv to JSON
            Papa.parse(regions, {
                delimiter: ',',
                download: true,
                header: true,
                skipEmptyLines: true,
                complete(results) {
                    updateElectionData(LAYER_REGION, results.data);
                    setRegionsCsv(results);
                },
            });

            // Convert departments csv to JSON
            Papa.parse(departements, {
                delimiter: ',',
                download: true,
                header: true,
                skipEmptyLines: true,
                complete(results) {
                    updateElectionData(LAYER_DEPARTMENT, results.data);
                    setDepartmentsCsv(results);
                },
            });

            // Convert cantons csv to JSON
            Papa.parse(cantons, {
                delimiter: ',',
                download: true,
                header: true,
                skipEmptyLines: true,
                complete(results) {
                    updateElectionData(LAYER_CANTONS, results.data);
                    setCantonsCsv(results);
                },
            });
            // Convert circonscriptions csv to JSON
            Papa.parse(circonscriptions, {
                delimiter: ',',
                download: true,
                header: true,
                skipEmptyLines: true,
                complete(results) {
                    updateElectionData(LAYER_CIRCONSCRIPTIONS, results.data);
                    setCirconscriptionsCsv(results);
                },
            });
        }
    }, [mapLoaded]);

    const getElectionTypes = () => {
        if (electionData[activeLayer] === undefined) {
            return [];
        }
        return electionData[activeLayer].map((code) => {
            const labelParts = code.split('|');
            const codeParts = [...labelParts];
            labelParts[2] = ELECTION_ROUND_LABELS[labelParts[2]];
            codeParts[0] = _.findKey(ELECTION_LABELS, (label) => label === codeParts[0]);
            return {
                code: codeParts.join('|'),
                label: labelParts.join(' - '),
            };
        });
    };

    return (
        <div>
            <LayerFilter choices={LAYERS_TYPES} onChange={(e) => setActiveLayer(e.target.value)} />

            <ElectionTypeFilter
                choices={getElectionTypes()}
                value={`${filterValues.electionType}|${filterValues.electionYear}|${filterValues.electionRound}`}
                onChange={(e) => setFilterValues(() => {
                    const value = e.target.value.split('|');
                    return {
                        electionType: value[0],
                        electionYear: value[1],
                        electionRound: value[2],
                    };
                })}
            />

            <div ref={mapContainer} className="map-container">
                <div id="map-overlay" />
            </div>
        </div>
    );
}

export default Elections;
