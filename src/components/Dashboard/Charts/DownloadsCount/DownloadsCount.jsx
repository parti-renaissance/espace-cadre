import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';

function DownloadsCount({ data }) {
    const count = data[data.length - 1].cumsum;
    return (
        <div className="with-background">
            <div className="row p-3">
                <span className="count-bubble">{count}</span>
                <div className="col pl-0">
                    <div className="chart-title">Téléchargements</div>
                    <div className="chart-subtitle">De l&apos;application Je m&apos;engage sur les stores Android et Apple</div>
                </div>
            </div>
            <div className="row">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5, right: 20, bottom: 5, left: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorQuotidien" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0049C6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0049C6" stopOpacity={0} />
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
                        <Area
                            type="monotone"
                            name="Téléchargements par jour"
                            dataKey="unique_user"
                            stroke="#0049C6"
                            fillOpacity={1}
                            fill="url(#colorQuotidien)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="row">
                <li className="legend-chart">Téléchargements par jour </li>
            </div>
        </div>
    );
}

export default DownloadsCount;

DownloadsCount.defaultProps = {
    data: [],
};

DownloadsCount.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
};
