import React, { useState, useEffect } from 'react';
import { apiClientProxy } from '../../services/networking/client';
import ActiveUsersComponent from './Charts/ActiveUsersComponent/ActiveUsersComponent';
import DownloadsCountComponent from './Charts/DownloadsCountComponent/DownloadsCountComponent';

const Dashboard = () => {
    const [downloadCount, setDownloadCount] = useState();
    const [activeUsers, setActiveUsers] = useState();
    const [adherentsCount, setAdherentsCount] = useState();

    useEffect(() => {
        let isActive = true;

        const getDashboardDatas = async () => {
            try {
                const getDownloadCount = await apiClientProxy.get('/jemengage/downloads');
                const getActiveUsers = await apiClientProxy.get('jemengage/users');
                const getAdherentsCount = await apiClientProxy.get('/adherents');

                if (isActive) {
                    setDownloadCount(getDownloadCount.downloads);
                    setActiveUsers(getActiveUsers.users);
                    setAdherentsCount(getAdherentsCount);
                }
            } catch (error) {
                if (isActive) {
                    console.log(error);
                }
            }
        };
        getDashboardDatas();

        // Cleanup function
        return () => {
            isActive = false;
        };
    }, []);

    return (
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
};

export default Dashboard;
