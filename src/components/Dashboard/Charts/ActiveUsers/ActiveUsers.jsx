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

function ActiveUsers({ data }) {
    const count = data[data.length - 1].rolling_seven_users;
    return (
        <div className="area-chart-container with-background">
            <div className="row p-3">
                <span className="count-bubble">{count}</span>
                <div className="col pl-0">
                    <div className="chart-title">Utilisateurs</div>
                    <div className="chart-subtitle">Actifs sur l&apos;application Je m&apos;engage</div>
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
                            <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0049C6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0049C6" stopOpacity={0} />
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
                        <Area
                            name="Utilisateurs par jour"
                            type="monotone"
                            dataKey="unique_user"
                            stroke="#0049C6"
                            fillOpacity={1}
                            fill="url(#colorUnique)"
                        />
                        <Area
                            name="Utilisateurs cumulés sur le dernier mois"
                            type="monotone"
                            dataKey="rolling_seven_users"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorCumul)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="row">
                <li className="legend-chart" style={{ color: '#0049C6' }}>Utilisateurs par jour</li>
                <li className="legend-chart" style={{ color: '#82ca9d' }}>Utilisateurs cumulés sur 7 jours</li>
            </div>
        </div>
    );
}

export default ActiveUsers;

ActiveUsers.defaultProps = {
    data: [],
};

ActiveUsers.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
};
