import React, { useState, useEffect } from 'react';

import { apiClientProxy } from '../../services/networking/client';

import ActiveUsersComponent from './Charts/ActiveUsersComponent/ActiveUsersComponent';
import DownloadsCountComponent from './Charts/DownloadsCountComponent/DownloadsCountComponent';
import MapComponent from './Map/MapComponent';
import Spinner from '../Spinner/Spinner';

const Dashboard = () => {
    const [downloadCount, setDownloadCount] = useState();
    const [activeUsers, setActiveUsers] = useState();
    const [adherentsCount, setAdherentsCount] = useState();
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

                if (isActive) {
                    setDownloadCount(getDownloadCount.downloads);
                    setActiveUsers(getActiveUsers.users);
                    setAdherentsCount(getAdherentsCount);
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
            <div className="container dashboardContainer">
                {adherentsCount && (
                    <div className="row dashboardRow">
                        <div className="col text-center">
                            La région {adherentsCount.zoneName} compte
                            {' '}{adherentsCount.adherentCount} adhérents
                        </div>
                    </div>
                )}
                <div className="row dashboardRow">
                    <div className="col">
                        <MapComponent />
                    </div>
                </div>
                <div className="row dashboardRow">
                    <div className="col">
                        <DownloadsCountComponent
                            title="Évolution du nombre de téléchargements quotidien de l'application"
                            data={downloadCount}
                        />
                    </div>
                </div>
                <div className="row dashboardRow">
                    <div className="col">
                        <ActiveUsersComponent
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
