/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import $ from 'jquery';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// import ElectionModal from './ElectionModal';
import LayerFilter from './Filter/LayerFilter';
import { apiClientProxy } from '../../services/networking/client';
import ElectionModal from './ElectionModal';

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
];

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPoint, setCurrentPoint] = useState();
    const [selectedElection, setSelectedElection] = useState('');
    const [participation, setParticipation] = useState([]);
    const [results, setResults] = useState([]);
    const [zone, setZone] = useState();

    // Display only the choosen layer
    const switchLayer = () => {
        LAYERS_TYPES.map((el) => map.current.setLayoutProperty(el.code, 'visibility', el.code === activeLayer ? 'visible' : 'none'));
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

    useEffect(() => mapLoaded && switchLayer(), [mapLoaded, activeLayer]);

    // Store in local state the election selected by the user
    const handleSelectedElection = (e) => {
        setSelectedElection(e.target.value);
    };

    useEffect(() => {
        if (!currentPoint || !mapLoaded) {
            return;
        }

        const propsFromMapbox = map.current.queryRenderedFeatures(currentPoint.point, { layers: [activeLayer] });
        setZone(propsFromMapbox[0].properties.nom);

        const getParticipation = async () => {
            if (selectedElection !== '') {
                try {
                    const electionAndYear = (selectedElection.substr(0, selectedElection.indexOf('-'))).trim();
                    const getTour = ((selectedElection.split('-')[1]).slice(1, 2)).trim();
                    setParticipation(await apiClientProxy.get(`/election/participation?maillage=${activeLayer}&code_zone=${propsFromMapbox[0].properties.code}&election=${electionAndYear}&tour=${getTour}`));
                    setResults(await apiClientProxy.get(`/election/results?maillage=${activeLayer}&code_zone=${propsFromMapbox[0].properties.code}&election=${electionAndYear}&tour=${getTour}`));
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getParticipation();
    }, [currentPoint]);

    useEffect(() => {
        const modalContent = document.getElementById('map-overlay');
        if (participation.length > 0 && results.length > 0) {
            modalContent.innerHTML = `
                            <div class="elections-area">${zone}</div>
                            <div class="election-name">${participation[0].election}</div>
                            <div id="close-modal">x</div>
                            <div class="flash-info">
                                <div class="flash-div"><span class="flash-span">${participation[0].inscrits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} inscrits</span></div>
                                <div class="flash-div">Votants: <span class="flash-span">${participation[0].votants.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span></div>
                                <div class="flash-div">Votes exprimés: <span class="flash-span">${participation[0].exprimes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span></div>
                            </div>
                            <div>
                            <div>
                                ${renderToString(results.sort((a, b) => b.voix - a.voix).map((element, i) => <ElectionModal key={i + 1} row={element} />))}
                            </div>
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
    }, [participation, results]);

    return (
        <div>
            <LayerFilter choices={LAYERS_TYPES} onChange={(e) => setActiveLayer(e.target.value)} />
            <select
                className="mb-3"
                onChange={handleSelectedElection}
            >
                <option>Sélectionnez une élection</option>
                {ELECTIONS_LIST.map((election, index) => <option key={index + 1} value={election}>{election}</option>)}
            </select>
            <div ref={mapContainer} className="map-container">
                <div id="map-overlay" />
            </div>
        </div>
    );
}

export default Elections;
