/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Papa from 'papaparse';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import regions from './data/regions.csv';
import departements from './data/departements.csv';
import cantons from './data/cantons.csv';
import ElectionTable from './ElectionTable';

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

const NUANCE = 'Nuance';
const LIST = 'Liste';
const ROUND = 'Tour';
const VOTE = 'Voix';
const TABLE_TITLE = [
    {
        code: NUANCE,
        label: 'Nuance',
    },
    {
        code: LIST,
        label: 'Liste',
    },
    {
        code: ROUND,
        label: 'Tour',
    },
    {
        code: VOTE,
        label: 'Voix',
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
    const [currentPoint, setCurrentPoint] = useState();
    const [electionType, setElectionType] = useState(ELECTION_TYPE_PRESIDENTIALS);
    const [roundInfo, setRoundInfo] = useState(FIRST_ROUND);

    const findZoneData = (code) => {
        let dataCsv;
        let filter;

        switch (activeLayer) {
        case LAYER_DEPARTMENT:
            dataCsv = departementsCsv;
            filter = (element) => element.departement === code;
            break;
        case LAYER_CANTONS:
            dataCsv = cantonsCsv;
            filter = (element) => element.code_canton === code;
            break;
        default:
            dataCsv = regionsCsv;
            filter = (element) => element.region === code;
            break;
        }

        return dataCsv.data.filter(
            (element) => filter(element)
                && element.election === electionType
                && element.tour === roundInfo.charAt(0),
        );
    };

    const switchLayer = () => {
        LAYERS_TYPES.map((el) => map.current.setLayoutProperty(el.code, 'visibility', el.code === activeLayer ? 'visible' : 'none'));
    };

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
        map.current.getCanvas().style.cursor = 'pointer';

        map.current.on('load', () => setMapLoaded(true));
        map.current.on('click', (event) => setCurrentPoint({ point: event.point, lngLat: event.lngLat }));
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

        if (!data.length) {
            return;
        }

        const popup = new mapboxgl.Popup();
        popup
            .setLngLat(currentPoint.lngLat)
            .setHTML(`
                <div class="elections-title">${data[0].election} ${data[0].annee}</div>
                <table class="table elections-table">
                    <thead>
                        <tr>
                            ${renderToString(TABLE_TITLE.map((title, i) => <th scope="col" key={i + 1}>{title.label}</th>))}
                        </tr>
                    </thead>
                    ${renderToString(data.map((element, i) => <ElectionTable key={i + 1} row={element} />))}
                </table>
            `)
            .addTo(map.current);
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
    }, [mapLoaded]);

    return (
        <div>
            <select className="mb-3 mr-3" onChange={(e) => setActiveLayer(e.target.value)}>
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
