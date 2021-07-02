import React, { useEffect } from 'react';
import {
    MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import L from 'leaflet';
import { useSelector } from 'react-redux';
import { useDashboardSurveyCache } from '../../../redux/dashboard/hooks';
import { apiClientProxy } from '../../../services/networking/client';
import Loader from '../../Loader';
import {
    getCurrentScope,
} from '../../../redux/user/selectors';

function MapComponent() {
    const [dashboardSurvey, setDashboardSurvey] = useDashboardSurveyCache();
    const currentScope = useSelector(getCurrentScope);

    useEffect(() => {
        const getSurvey = async () => {
            try {
                if (dashboardSurvey === null) {
                    const encodedScope = btoa(JSON.stringify(currentScope));
                    setDashboardSurvey(await apiClientProxy.get(`/jemengage/survey?scope=${encodedScope}`));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getSurvey();
    }, []);
    L.Icon.Default.imagePath = 'images/';
    return (
        <>
            {dashboardSurvey !== null ? (
                <div className="with-background dc-container w-100">
                    <div className="row p-3">
                        <span className="count-bubble ml-3">{ dashboardSurvey.survey_datas.length }</span>
                        <div className="col pl-0">
                            <div className="chart-title">Questionnaire{ dashboardSurvey.survey_datas.length > 1 && 's' } rempli{ dashboardSurvey.survey_datas.length > 1 && 's' }</div>
                            <div className="chart-subtitle">Répartition géographique dans votre région</div>
                        </div>
                    </div>
                    <MapContainer
                        center={[dashboardSurvey.latitude, dashboardSurvey.longitude]}
                        zoom={8}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                        />

                        {dashboardSurvey.survey_datas.map((data) => (
                            <Marker key={data.id} position={[data.latitude, data.longitude]}>
                                <Popup>
                                    <strong>Nom du sondage:</strong> {data.survey.name} <br />
                                    <strong>Répondu le:</strong> {data.posted_at}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            ) : <div className="text-center"><Loader /></div>}
        </>
    );
}

export default MapComponent;
