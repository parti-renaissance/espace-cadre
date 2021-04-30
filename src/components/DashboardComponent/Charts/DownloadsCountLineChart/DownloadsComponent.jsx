import React from 'react';
import {
    ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import './DownloadsComponent.scss';
import PropTypes from 'prop-types';

function DownloadsComponent({ title, data }) {
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
                    <XAxis
                        dataKey="date"
                        angle={-14}
                        tickMargin={8}
                        interval={4}
                    />
                    <YAxis />
                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                    <Tooltip
                        contentStyle={{
                            background: '#fff',
                            borderColor: '#F0F1F3',
                            borderRadius: '16px',
                        }}
                        labelStyle={{
                            color: '#0049C6',
                            fontFamily: 'Poppins',
                        }}
                        itemStyle={{
                            fontFamily: 'Poppins',
                            color: '#0049C6',
                            padding: '2px 5px',
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        layout="horizontal"

                    />
                    <Line
                        name="Téléchargements"
                        type="monotone"
                        dataKey="unique_user"
                        stroke="#8884d8"
                    />
                    <Line
                        name="Cumul sur la période"
                        type="monotone"
                        dataKey="cumsum"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DownloadsComponent;

DownloadsComponent.defaultProps = {
    data: [],
};

DownloadsComponent.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
};
