import React from 'react';
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount';
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign';
import MapComponent from './Map/MapComponent';
import TextChart from './Charts/TextChart/TextChart';

const Dashboard = () => (
    <div className="container">
        <div className="row mb-3">
            <div className="col p-0">
                <TextChart />
            </div>
        </div>
        <KpiEmailCampaign />
        <div className="row">
            <p className="title"><img src="images/smartphone.svg" alt="smartphone-logo" className="ml-2 mr-2" />Application mobile</p>
        </div>
        <div className="row mb-3">
            <div className="col-lg-6 left-chart mb-3 mb-lg-0">
                <div className="col-md-12 with-background dc-container">
                    <DownloadsCount />
                </div>
            </div>
            <div className="col-lg-6 right-chart">
                <div className="col-md-12 with-background dc-container">
                    <ActiveUsers />
                </div>
            </div>
        </div>
        <div className="row mb-3 with-background dc-container">
            <div className="col p-0">
                <MapComponent />
            </div>
        </div>
    </div>
);
export default Dashboard;
