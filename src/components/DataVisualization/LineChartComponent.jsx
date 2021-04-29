import React from 'react';
import {
    ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis,
} from 'recharts';
import './LineChartComponent.scss';
import PropTypes from 'prop-types';

function LineChartComponent({ title, data }) {
    return (
        <div className="lineChartContainer">
            <div className="title">{title}</div>
            <ResponsiveContainer width="95%" height={400}>
                <LineChart
                    data={data}
                    margin={{
                        top: 5, right: 20, bottom: 5, left: 0,
                    }}
                >
                    <Line type="monotone" dataKey="adherents" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="jour" />
                    <YAxis />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LineChartComponent;

LineChartComponent.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
