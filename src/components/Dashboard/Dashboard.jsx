import React, { useState, useEffect } from 'react';

import { apiClientProxy } from '../../services/networking/client';

import ActiveUsers from './Charts/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount';
import TextChart from './Charts/TextChart';
import MapComponent from './Map/MapComponent';
import Spinner from '../Spinner/Spinner';

const Dashboard = () => {
    const [downloadCount, setDownloadCount] = useState();
    const [activeUsers, setActiveUsers] = useState();
    const [adherentsCount, setAdherentsCount] = useState();
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
                const getAdherentsCount = await apiClientProxy.get('/adherents');
                const getMapData = await apiClientProxy.get('/jemengage/survey');

                if (isActive) {
                    setDownloadCount(getDownloadCount.downloads);
                    setActiveUsers(getActiveUsers.users);
                    setAdherentsCount(getAdherentsCount);
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
                {adherentsCount && <TextChart adherentsCount={adherentsCount} />}

                <div className="row">
                    <div className="col">
                        {mapData && <MapComponent mapData={mapData} />}
                    </div>
                </div>
                <div className="row dashboard-row with-background dc-container">
                    <div className="col">
                        <DownloadsCount
                            title="Évolution du nombre de téléchargements quotidien de l'application"
                            data={downloadCount}
                        />
                    </div>
                </div>
                <div className="row dashboard-row with-background dc-container">
                    <div className="col">
                        <ActiveUsers
                            title="Évolution du nombre d'utilisateurs actifs"
                            data={activeUsers}
                        />
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
