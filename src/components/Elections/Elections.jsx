import { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import $ from 'jquery';
import qs from 'qs';
import { Grid, Box } from '@material-ui/core';
import mapboxgl from '!mapbox-gl';
import LayerFilter from './Filter/LayerFilter';
import { apiClientProxy } from '../../services/networking/client';
import ElectionModal from './ElectionModal';
import Loader from '../HelperComponents/Loader';
import ConvertToPercent from '../HelperComponents/ConvertToPercent';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const LAYER_REGION = 'region';
const LAYER_DEPARTMENT = 'departement';
const LAYER_CANTONS = 'canton';
const LAYER_CIRCONSCRIPTIONS = 'circonscription';
const LAYER_COMMUNES = 'commune';
const LAYER_POLLING_STATION = 'bureau';

const LAYERS_TYPES = {};
LAYERS_TYPES[LAYER_REGION] = 'Régions';
LAYERS_TYPES[LAYER_DEPARTMENT] = 'Départements';
LAYERS_TYPES[LAYER_CANTONS] = 'Cantons';
LAYERS_TYPES[LAYER_CIRCONSCRIPTIONS] = 'Circonscriptions';
LAYERS_TYPES[LAYER_COMMUNES] = 'Communes';
LAYERS_TYPES[LAYER_POLLING_STATION] = 'Bureaux de vote';

const ELECTION_ROUND_FIRST = '1';
const ELECTION_ROUND_SECOND = '2';

const ELECTION_ROUND_LABELS = {};
ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST] = '1er tour';
ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND] = '2e tour';

const ELECTION_TYPE_PRESIDENTIAL = 'Présidentielles';
const ELECTION_TYPE_DEPARTMENTAL = 'Départementales';
const ELECTION_TYPE_LEGISLATIVE = 'Législatives';
const ELECTION_TYPE_REGIONAL = 'Régionales';
const ELECTION_TYPE_EUROPEAN = 'Européennes';
const ELECTION_TYPE_MUNICIPAL = 'Municipales';

const ELECTION_TYPES = [
    {
        label: ELECTION_TYPE_EUROPEAN,
        year: 2014,
        rounds: 1,
    },
    {
        label: ELECTION_TYPE_DEPARTMENTAL,
        year: 2015,
        rounds: 2,
    },
    {
        label: ELECTION_TYPE_REGIONAL,
        year: 2015,
        rounds: 2,
    },
    {
        label: ELECTION_TYPE_PRESIDENTIAL,
        year: 2017,
        rounds: 2,
    },
    {
        label: ELECTION_TYPE_LEGISLATIVE,
        year: 2017,
        rounds: 2,
    },
    {
        label: ELECTION_TYPE_EUROPEAN,
        year: 2019,
        rounds: 1,
    },
    {
        label: ELECTION_TYPE_MUNICIPAL,
        year: 2020,
        rounds: 2,
    },
    {
        label: ELECTION_TYPE_REGIONAL,
        year: 2021,
        rounds: 2,
    },
    {
        label: ELECTION_TYPE_DEPARTMENTAL,
        year: 2021,
        rounds: 2,
    },
];

const Elections = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPoint, setCurrentPoint] = useState();
    const [participation, setParticipation] = useState([]);
    const [results, setResults] = useState([]);
    const [zone, setZone] = useState();
    const [filterValues, setFilterValues] = useState({
        election: ELECTION_TYPE_PRESIDENTIAL,
        year: 2017,
        round: ELECTION_ROUND_FIRST,
    });

    const modalContent = document.getElementById('map-overlay');

    useEffect(() => {
        // initialize map only once
        if (map.current) {
            return;
        }

        // Display the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            minZoom: 4,
        });
    }, []);

    // Change layer
    useEffect(() => {
        // Display only the choosen layer
        const switchLayer = () => {
            Object.entries(LAYERS_TYPES).map(
                (line) => map.current.setLayoutProperty(line[0], 'visibility', line[0] === activeLayer ? 'visible' : 'none'),
            );
        };

        return mapLoaded && switchLayer();
    }, [mapLoaded, activeLayer]);

    // Indicate map is loaded and close modal on click
    useEffect(() => {
        map.current.getCanvas().style.cursor = 'pointer';

        map.current.on('load', () => setMapLoaded(true));

        map.current.on('click', (event) => setCurrentPoint({ point: event.point, lngLat: event.lngLat }));

        // Close the modal on click
        $('#map-overlay').on('click', '#close-modal', () => {
            $('#map-overlay').empty();
        });
    }, [map]);

    useEffect(() => {
        if (!mapLoaded) {
            return;
        }

        map.current.setPaintProperty(activeLayer, 'fill-color', [
            'coalesce',
            ['get', `${filterValues.election.charAt(0)}_${filterValues.year}_${filterValues.round}`],
            'rgba(0,0,0,0)',
        ]);
    }, [mapLoaded, activeLayer, filterValues]);

    // Fetch participation and results endpoints
    useEffect(() => {
        let isCancelled = false;

        if (!currentPoint || !mapLoaded) {
            return;
        }

        const getParticipation = async () => {
            if (!isCancelled) {
                const propsFromMapbox = map.current.queryRenderedFeatures(
                    currentPoint.point,
                    { layers: [activeLayer] },
                );

                if (!propsFromMapbox || !propsFromMapbox.length) {
                    return;
                }

                setZone(propsFromMapbox[0].properties.nom);

                modalContent.innerHTML = `<div class="modal-error text-center">${renderToString(<Loader />)}</div>`;

                const query = qs.stringify({
                    maillage: activeLayer,
                    code_zone: propsFromMapbox[0].properties.code,
                    election: `${filterValues.election} ${filterValues.year}`,
                    tour: filterValues.round,
                });

                setParticipation(await apiClientProxy.get(`/election/participation?${query}`));
                setResults(await apiClientProxy.get(`/election/results?${query}`));
            }
        };
        getParticipation();

        return () => {
            isCancelled = true;
        };
    }, [activeLayer, currentPoint, filterValues, mapLoaded, modalContent]);

    // Populate modal when participation and results data are ready
    useEffect(() => {
        if (!modalContent) {
            return;
        }

        const contentParts = [
            `<div class="elections-area">${zone || ''}</div>`,
            `<div class="election-name">${filterValues.election} ${filterValues.year} - ${filterValues.round === ELECTION_ROUND_FIRST ? ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST] : ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}</div>`,
            '<div id="close-modal">x</div>',
        ];

        if (participation.length && results.length) {
            contentParts.push(`
                <div class="flash-info">
                    <div class="flash-div"><span class="flash-span">${participation[0].inscrits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} inscrits</span></div>
                    <div class="flash-div">
                        Taux de participation: 
                        <span class="flash-span">
                            ${renderToString(<ConvertToPercent valueToConvert={participation[0].votants / participation[0].inscrits} />)}
                        </span>
                    </div>
                    <div class="flash-div">Blancs et nuls: <span class="flash-span">${(((participation[0].exprimes - participation[0].exprimes) / participation[0].exprimes) * 100).toFixed(2)}%</span></div>
                </div>`);

            contentParts.push(`<div>${renderToString(results.sort((a, b) => b.voix - a.voix).map((element, i) => <ElectionModal key={i + 1} row={element} exprimes={participation[0].exprimes} />))}</div>`);
        } else {
            contentParts.push('<div class="flash-info"><div class="modal-error">Aucune donnée à afficher</div></div>');
        }

        modalContent.innerHTML = contentParts.join('');
    }, [filterValues, modalContent, participation, results, zone]);

    const electionSelectRows = [];

    ELECTION_TYPES.forEach((election) => {
        const value = `${election.label}_${election.year}`;
        const label = `${election.label} ${election.year} - `;

        electionSelectRows.push(<option key={`${value}_1`} value={`${value}_1`}>{`${label}${election.rounds === 1 ? 'Tour unique' : '1er tour'}`}</option>);

        if (election.rounds === 2) {
            electionSelectRows.push(<option key={`${value}_2`} value={`${value}_2`}>{`${label}2er tour`}</option>);
        }
    });

    return (
        <>
            <Grid container style={{ marginBottom: '8px' }}>
                <Grid item>
                    <LayerFilter
                        choices={Object.entries(LAYERS_TYPES).map((line) => ({ code: line[0], label: line[1] }))}
                        onChange={(e) => setActiveLayer(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <select
                        onChange={(event) => {
                            const parts = event.target.value.split('_');
                            setFilterValues({
                                election: parts[0],
                                year: parts[1],
                                round: parts[2],
                            });
                        }}
                        value={`${filterValues.election}_${filterValues.year}_${filterValues.round}`}
                    >{electionSelectRows}
                    </select>
                </Grid>
                <Grid item>
                    <Box className="map-help">
                        Aidez-nous à améliorer cette carte en écrivant à <a href="mailto:techsupport@en-marche.fr">techsupport@en-marche.fr</a>
                    </Box>
                </Grid>
            </Grid>
            <Grid ref={mapContainer} item className="map-container">
                <Box id="map-overlay" />
            </Grid>
        </>
    );
};

export default Elections;
