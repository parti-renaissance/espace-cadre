/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import $ from 'jquery';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ElectionModal from './ElectionModal';
import LayerFilter from './Filter/LayerFilter';

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

const ELECTIONS_LIST = [
    'Européennes 2014',
    `Départementales 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `Départementales 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `Régionales 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `Régionales 2015 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `Présidentielles 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `Présidentielles 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `Législatives 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `Législatives 2017 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    'Européennes 2019',
    `Municipales 2020 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `Municipales 2020 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
    `Régionales 2021 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_FIRST]}`,
    `Régionales 2021 - ${ELECTION_ROUND_LABELS[ELECTION_ROUND_SECOND]}`,
];

function Elections() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [activeLayer, setActiveLayer] = useState(LAYER_REGION);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPoint, setCurrentPoint] = useState();
    const [selectedElection, setSelectedElection] = useState('');

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
            center: [2.3487871369502145, 48.85335278688857],
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

    const handleSelectedElection = (e) => {
        setSelectedElection(e.target.value);
    };

    useEffect(() => {
        console.log(selectedElection);
    }, [selectedElection]);

    console.log(activeLayer);

    return (
        <div>
            <LayerFilter choices={LAYERS_TYPES} onChange={(e) => setActiveLayer(e.target.value)} />
            <select
                className="mb-3"
                onChange={handleSelectedElection}
            >
                <option>Type d&apos;élection</option>
                {ELECTIONS_LIST.map((election, index) => <option key={index + 1} value={election}>{election}</option>)}
            </select>
            <div ref={mapContainer} className="map-container">
                <div id="map-overlay" />
            </div>
        </div>
    );
}

export default Elections;
