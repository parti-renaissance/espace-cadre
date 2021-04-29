import React from 'react';
import LineChartComponent from '../DataVisualization/LineChartComponent';
import data from './data';

const Dashboard = () => (
    <div className="container dashboardContainer">
        <div className="row dashboardRow">
            <div className="col">
                <LineChartComponent data={data} title="Evolution du nombre d'utilisateurs actifs" />
            </div>
        </div>
        <div className="row dashboardRow">
            <div className="col">
                <LineChartComponent data={data} title="Evolution du nombre d'adhérents" />
            </div>
        </div>
        <div className="row dashboardRow">
            <div className="col">
                <LineChartComponent data={data} title="Evolution du nombre de téléchargements" />
            </div>
        </div>
    </div>

);

export default Dashboard;
