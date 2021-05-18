import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';

function DownloadsRatios({ data }) {
    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="downloadsPer1000" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="nationalPer1000" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DownloadsRatios;

DownloadsRatios.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
