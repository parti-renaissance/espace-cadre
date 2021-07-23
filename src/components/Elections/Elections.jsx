/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import $ from 'jquery';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LayerFilter from './Filter/LayerFilter';
import { apiClientProxy } from '../../services/networking/client';
import ElectionModal from './ElectionModal';
import Loader from '../Loader';
import ConvertToPercent from '../ConvertToPercent/ConvertToPercent';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const LAYER_REGION = 'region';
const LAYER_DEPARTMENT = 'departement';
const LAYER_CANTONS = 'canton';
const LAYER_CIRCONSCRIPTIONS = 'circonscription';
const LAYER_COMMUNES = 'commune';
const LAYER_POLLING_STATION = 'bureau';
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
    {
        code: LAYER_COMMUNES,
        label: 'Communes',
    },
    {
        code: LAYER_POLLING_STATION,
        label: 'Bureaux de vote',
    },
];
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

const ELECTIONS_LIST = [
    `${ELECTION_TYPE_EUROPEAN} 2014`,
    `${ELECTION_TYPE_DEPARTMENTAL} 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_DEPARTMENTAL} 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `${ELECTION_TYPE_REGIONAL} 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_REGIONAL} 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `${ELECTION_TYPE_PRESIDENTIAL} 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_PRESIDENTIAL} 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `${ELECTION_TYPE_LEGISLATIVE} 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_LEGISLATIVE} 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `${ELECTION_TYPE_EUROPEAN} 2019`,
    `${ELECTION_TYPE_MUNICIPAL} 2020 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_MUNICIPAL} 2020 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `${ELECTION_TYPE_REGIONAL} 2021 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_REGIONAL} 2021 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `${ELECTION_TYPE_DEPARTMENTAL} 2021 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `${ELECTION_TYPE_DEPARTMENTAL} 2021 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
];

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPoint, setCurrentPoint] = useState();
    const [selectedElection, setSelectedElection] = useState(ELECTIONS_LIST[5]);
    const [participation, setParticipation] = useState([]);
    const [results, setResults] = useState([]);
    const [colors, setColors] = useState([]);
    const [zone, setZone] = useState();
    const modalContent = document.getElementById('map-overlay');
    const electionAndYear = (selectedElection.substr(0, selectedElection.indexOf('-'))).trim();
    const getTour = ((selectedElection.split('-')[1]).slice(1, 2)).trim();

    // Display only the choosen layer
    const switchLayer = () => {
        LAYERS_TYPES.map((el) => map.current.setLayoutProperty(el.code, 'visibility', el.code === activeLayer ? 'visible' : 'none'));
    };

    // Store in local state the election selected by the user
    const handleSelectedElection = (e) => {
        setSelectedElection(e.target.value);
    };

    // Get data from color endpoint
    const getColors = async () => {
        setColors(await apiClientProxy.get(`/election/colors?maillage=${activeLayer}&election=${electionAndYear}&tour=${getTour}`));
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

        getColors();
    }, []);

    useEffect(() => {
        console.log(colors);
    }, [colors]);

    // Change layer
    useEffect(() => mapLoaded && switchLayer(), [mapLoaded, activeLayer]);

    // Indicate map is loaded and close modal on click
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

    // Fetch participation and results endpoints
    useEffect(() => {
        let isCancelled = false;

        if (!currentPoint || !mapLoaded) {
            return;
        }

        const getParticipation = async () => {
            try {
                if (!isCancelled) {
                    const propsFromMapbox = map.current.queryRenderedFeatures(currentPoint.point,
                        { layers: [activeLayer] });
                    setZone(propsFromMapbox[0].properties.nom);
                    const codeZone = propsFromMapbox[0].properties.code;

                    modalContent.innerHTML = `
                        <div class="modal-error text-center">
                                ${renderToString(<Loader />)}
                        </div>
                    `;
                    setParticipation(await apiClientProxy.get(`/election/participation?maillage=${activeLayer}&code_zone=${codeZone}&election=${electionAndYear}&tour=${getTour}`));
                    setResults(await apiClientProxy.get(`/election/results?maillage=${activeLayer}&code_zone=${codeZone}&election=${electionAndYear}&tour=${getTour}`));
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

    // Commune and bureau layers only appear at zoomlevel 7 and 9. User must zoom in map
    useEffect(() => {
        if (activeLayer === 'bureau' || activeLayer === 'commune') {
            modalContent.innerHTML = '<div class="modal-error">Zoomer sur la carte pour afficher les périmètres</div>';
        } else {
            $('#map-overlay').empty();
        }
    }, [activeLayer]);

    return (
        <>
            <LayerFilter choices={LAYERS_TYPES} onChange={(e) => setActiveLayer(e.target.value)} />
            <select
                className="mb-3"
                onChange={handleSelectedElection}
                value={selectedElection}
            >
                {ELECTIONS_LIST.map((election, index) => <option key={index + 1} value={election}>{election}</option>)}
            </select>
            <div ref={mapContainer} className="map-container">
                <div id="map-overlay" />
            </div>
        </>
    );
}

export default Elections;
