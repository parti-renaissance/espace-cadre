import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';
import PropTypes from 'prop-types';

function DownloadsRatios({ title, data }) {
    return (
        <div className="ratio-chart-container">
            <div className="title">{title}</div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 5, right: 20, bottom: 5, left: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorQuotidien" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCumul" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        angle={-14}
                        tickMargin={8}
                        interval={4}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                    />
                    <CartesianGrid strokeDasharray=".08" />
                    <Tooltip
                        contentStyle={{
                            background: '#fff',
                            borderColor: '#F0F1F3',
                            borderRadius: '16px',
                        }}
                        labelStyle={{
                            color: '#1A334D',
                            fontFamily: 'Poppins',
                            fontWeight: 'bold',
                            padding: '2px 5px',
                            textAlign: 'left',
                        }}
                        itemStyle={{
                            fontFamily: 'Poppins',
                            color: '#0049C6',
                            padding: '2px 5px',
                            textAlign: 'left',
                        }}
                        cursor={{
                            stroke: '#0049C6',
                            strokeWidth: 0.5,
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        layout="horizontal"
                    />
                    <Area
                        name="Sur la région"
                        type="monotone"
                        dataKey="downloadsPer1000"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorQuotidien)"
                    />
                    <Area
                        name="Au national"
                        type="monotone"
                        dataKey="nationalPer1000"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorCumul)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DownloadsRatios;

DownloadsRatios.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
