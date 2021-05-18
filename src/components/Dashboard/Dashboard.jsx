import React, { useState, useEffect } from 'react';

import { apiClientProxy } from '../../services/networking/client';

import ActiveUsers from './Charts/ActiveUsers/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount';
import DownloadsRatios from './Charts/DownloadsRatios/DownloadsRatios';
import MapComponent from './Map/MapComponent';
import Spinner from '../Spinner/Spinner';

const Dashboard = () => {
    const [downloadCount, setDownloadCount] = useState();
    const [activeUsers, setActiveUsers] = useState();
    const [downloadsRatios, setdownloadsRatios] = useState();
    const [mapData, setMapData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    let content;
    useEffect(() => {
        let isActive = true;

        const getDashboardDatas = async () => {
            try {
                setLoading(true);
                setError(false);

                const getDownloadCount = await apiClientProxy.get('/jemengage/downloads');
                const getActiveUsers = await apiClientProxy.get('jemengage/users');
                const getDownloadsRatios = await apiClientProxy.get('/jemengage/downloadsRatios');
                const getMapData = await apiClientProxy.get('/jemengage/survey');

                if (isActive) {
                    setDownloadCount(getDownloadCount.downloads);
                    setActiveUsers(getActiveUsers.users);
                    setdownloadsRatios(getDownloadsRatios.downloads);
                    setMapData(getMapData);
                    setLoading(false);
                }
            } catch (er) {
                if (isActive) {
                    setError(true);
                }
            }
        };
        getDashboardDatas();

        // Cleanup function
        return () => {
            isActive = false;
        };
    }, []);

    if (error) {
        content = <div className="alert alert-danger w-50" role="alert">Erreur dans le chargement de la page</div>;
    } else if (loading) {
        content = <Spinner />;
    } else {
        content = (
            <div className="container dashboard-container">
                <div className="row mb-3">
                    <div className="col-lg-6 left-chart">
                        <div className="col-md-12 with-background dc-container">
                            <DownloadsCount
                                title="Téléchargements"
                                data={downloadCount}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 right-chart">
                        <div className="col-md-12 with-background dc-container">
                            <ActiveUsers
                                title="Utilisateurs"
                                data={activeUsers}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col map-col">
                        {mapData && <MapComponent mapData={mapData} />}
                    </div>
                </div>
                <div className="row mb-3 with-background dc-container">
                    <div className="col">
                        {downloadsRatios && <DownloadsRatios data={downloadsRatios} />}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {content}
        </>
    );
};

export default Dashboard;
