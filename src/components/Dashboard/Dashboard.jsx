import React from 'react';
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount';
import DownloadsRatios from './Charts/DownloadsRatios/DownloadsRatios';
import EmailCampaign from './Charts/EmailCampaign/EmailCampaign';
import MapComponent from './Map/MapComponent';
import TextChart from './Charts/TextChart/TextChart';

const Dashboard = () => (
    <div className="container">
        <EmailCampaign />
        <div className="row">
            <p className="title">Application mobile</p>
        </div>
        <div className="row">
            <div className="col">
                <TextChart />
            </div>
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
            <div className="col">
                <DownloadsRatios />
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
