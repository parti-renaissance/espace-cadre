import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActiveUsersComponent from './Charts/ActiveUsersComponent/ActiveUsersComponent';
import DownloadsCountComponent from './Charts/DownloadsCountComponent/DownloadsCountComponent';

const Dashboard = () => {
    const [downloadCount, setDownloadCount] = useState();
    const [activeUsers, setActiveUsers] = useState();
    const [adherentsCount, setAdherentsCount] = useState();

    useEffect(() => {
        let isActive = true;

        function getDownloadCount() {
            return axios.get('https://app-du-milieu-x44qrxc7fq-ew.a.run.app/jemengage/downloads', {
                headers: {
                    'X-USER-UUID': '6156224e-855b-5dd2-872f-cf5d748eb69a',
                },
            });
        }

        function getActiveUsers() {
            return axios.get('https://app-du-milieu-x44qrxc7fq-ew.a.run.app/jemengage/users', {
                headers: {
                    'X-USER-UUID': '6156224e-855b-5dd2-872f-cf5d748eb69a',
                },
            });
        }

        function getAdherentsCount() {
            return axios.get('https://app-du-milieu-x44qrxc7fq-ew.a.run.app/adherents', {
                headers: {
                    'X-USER-UUID': '6156224e-855b-5dd2-872f-cf5d748eb69a',
                },
            });
        }

        Promise.all([getDownloadCount(), getActiveUsers(), getAdherentsCount()])
            .then((results) => {
                if (isActive) {
                    setDownloadCount(results[0].data.downloads);
                    setActiveUsers(results[1].data.downloads);
                    setAdherentsCount(results[2].data);
                }
            })
            .catch((error) => console.log(error));

        // Cleanup function
        return () => {
            console.log('unmount');
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
            {/* <div className="row dashboardRow">
                <div className="col">
                    <LineChartComponent
                        title="Evolution du nombre d'utilisateurs actifs" />
                </div>
            </div>
            <div className="row dashboardRow">
                <div className="col">
                    <LineChartComponent data={data} title="Evolution du nombre d'adhérents" />
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;
