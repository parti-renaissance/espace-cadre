import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import $ from 'jquery';
import _ from 'lodash';
import qs from 'qs';
// eslint-disable-next-line import/no-unresolved
import mapboxgl from '!mapbox-gl';
import LayerFilter from './Filter/LayerFilter';
import { apiClientProxy } from '../../services/networking/client';
import ElectionModal from './ElectionModal';
import Loader from '../Loader';
import ConvertToPercent from '../ConvertToPercent/ConvertToPercent';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const LAYER_REGION = 'regions';
const LAYER_DEPARTMENT = 'departements';
const LAYER_CANTONS = 'cantons';
const LAYER_CIRCONSCRIPTIONS = 'circonscriptions';
// const LAYER_COMMUNES = 'communes';
// const LAYER_POLLING_STATION = 'bureaux-vote';

const LAYERS_TYPES = {};

LAYERS_TYPES[LAYER_REGION] = {
    code: LAYER_REGION,
    label: 'Régions',
    code2: 'region',
};
LAYERS_TYPES[LAYER_DEPARTMENT] = {
    code: LAYER_DEPARTMENT,
    label: 'Départements',
    code2: 'departement',
};
LAYERS_TYPES[LAYER_CANTONS] = {
    code: LAYER_CANTONS,
    label: 'Cantons',
    code2: 'canton',
};
LAYERS_TYPES[LAYER_CIRCONSCRIPTIONS] = {
    code: LAYER_CIRCONSCRIPTIONS,
    label: 'Circonscriptions',
    code2: 'circonscription',
};
// LAYERS_TYPES[LAYER_COMMUNES] = {
//     code: LAYER_COMMUNES,
//     label: 'Communes',
//     code2: 'commune',
// };
// LAYERS_TYPES[LAYER_POLLING_STATION] = {
//     code: LAYER_POLLING_STATION,
//     label: 'Bureaux de vote',
//     code2: 'bureau',
// };

const ELECTION_TYPE_PRESIDENTIAL = 'Présidentielles';
const ELECTION_TYPE_DEPARTMENTAL = 'Départementales';
const ELECTION_TYPE_LEGISLATIVE = 'Législatives';
const ELECTION_TYPE_REGIONAL = 'Régionales';
const ELECTION_TYPE_EUROPEAN = 'Européennes';
const ELECTION_TYPE_MUNICIPAL = 'Municipales';

const ELECTION_ROUND_FIRST = '1';
const ELECTION_ROUND_SECOND = '2';

const ELECTION_ROUND_LABELS = {};
ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST] = '1er tour';
ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND] = '2e tour';

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
        round: 1,
    });

    const modalContent = document.getElementById('map-overlay');

    const getColors = async () => apiClientProxy.get(`/election/colors?${qs.stringify({
        maillage: LAYERS_TYPES[activeLayer].code2,
        election: `${filterValues.election} ${filterValues.year}`,
        tour: filterValues.round,
    })}`);

    // Display only the choosen layer
    const switchLayer = () => {
        Object.entries(LAYERS_TYPES).map(
            (line) => map.current.setLayoutProperty(
                line[1].code,
                'visibility',
                line[1].code === activeLayer ? 'visible' : 'none',
            ),
        );
    };

    useEffect(() => {
        // initialize map only once
        if (map.current) {
            return;
        }

        // Display the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/larem/ckrusz9vq2qh017pkq1nb13gz',
            center: [2.213749, 46.227638],
            zoom: 5,
        });
    }, []);

    // Change layer
    useEffect(() => mapLoaded && switchLayer(), [mapLoaded, activeLayer]);

    // Indicate map is loaded and close modal on click
    useEffect(() => {
        map.current.getCanvas().style.cursor = 'pointer';

        map.current.on('load', () => {
            setMapLoaded(true);
        });

        map.current.on('click', (event) => {
            setCurrentPoint({ point: event.point, lngLat: event.lngLat });
        });

        // Close the modal on click
        $('#map-overlay').on('click', '#close-modal', () => {
            $('#map-overlay').empty();
        });
    }, [map]);

    useEffect(() => {
        const callback = async () => {
            if (!mapLoaded) {
                return;
            }

            const colors = await getColors();
            const sortedColors = {};

            colors.forEach((color) => {
                if (sortedColors[color.code_couleur] === undefined) {
                    sortedColors[color.code_couleur] = [];
                }

                sortedColors[color.code_couleur].push(`${color.code}`);
            });

            map.current.queryRenderedFeatures({ layers: [activeLayer] }).forEach((feature) => {
                map.current.setFeatureState(
                    feature,
                    { color: _.findKey(sortedColors, (codes) => codes.indexOf(feature.properties.code) !== -1) },
                );
            });
        };
        callback();
    }, [mapLoaded, activeLayer, filterValues]);

    // Fetch participation and results endpoints
    useEffect(() => {
        let isCancelled = false;

        if (!currentPoint || !mapLoaded) {
            return;
        }

        const getParticipation = async () => {
            try {
                if (!isCancelled) {
                    const propsFromMapbox = map.current.queryRenderedFeatures(
                        currentPoint.point,
                        { layers: [activeLayer] },
                    );

                    setZone(propsFromMapbox[0].properties.nom);

                    modalContent.innerHTML = `<div class="modal-error text-center">${renderToString(<Loader />)}</div>`;

                    const query = qs.stringify({
                        maillage: LAYERS_TYPES[activeLayer].code2,
                        code_zone: propsFromMapbox[0].properties.code,
                        election: `${filterValues.election} ${filterValues.year}`,
                        tour: filterValues.round,
                    });

                    setParticipation(await apiClientProxy.get(`/election/participation?${query}`));
                    setResults(await apiClientProxy.get(`/election/results?${query}`));
                }
            } catch (error) {
                if (!isCancelled) {
                    modalContent.innerHTML = '<div class="modal-error">Aucune donnée à afficher</div>';
                }
            }
        };
        getParticipation();

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true;
        };
    }, [currentPoint]);

    // Populate modal when participation and results data are ready
    useEffect(() => {
        try {
            if (participation.length > 0 && results.length > 0) {
                modalContent.innerHTML = `
                    <div class="elections-area">${zone}</div>
                    <div class="election-name">${participation[0].election} - ${participation[0].tour === 1 ? ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST] : ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}</div>
                    <div id="close-modal">x</div>
                    <div class="flash-info">
                        <div class="flash-div"><span class="flash-span">${participation[0].inscrits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} inscrits</span></div>
                        <div class="flash-div">Taux de participation: <span class="flash-span">${renderToString(<ConvertToPercent valueToConvert={participation[0].votants / participation[0].inscrits} />)}</span></div>
                        <div class="flash-div">Blancs et nuls: <span class="flash-span">${(((participation[0].votants - participation[0].exprimes) / participation[0].votants) * 100).toFixed(2)}%</span></div>
                    </div>
                    <div>
                    <div>
                        ${renderToString(results.sort((a, b) => b.voix - a.voix).map((element, i) => <ElectionModal key={i + 1} row={element} exprimes={participation[0].exprimes} />))}
                    </div>
                    </div>
                `;
            }
        } catch (error) {
            modalContent.innerHTML = '<div class="modal-error">Aucune donnée à afficher</div>';
        }
    }, [participation, results]);

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
            <LayerFilter
                choices={Object.entries(LAYERS_TYPES).map((line) => line[1])}
                onChange={(e) => setActiveLayer(e.target.value)}
            />

            <select
                className="mb-3"
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

            <div ref={mapContainer} className="map-container">
                <div id="map-overlay" />
            </div>
        </>
    );
};

export default Elections;
