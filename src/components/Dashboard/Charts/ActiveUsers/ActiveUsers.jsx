import React, { useEffect } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useDashboardUsersCache } from '../../../../redux/dashboard/hooks';

function ActiveUsers() {
    const [dashboardUsers, setDashboardUsers] = useDashboardUsersCache();

    useEffect(() => {
        const getDashboardUsers = async () => {
            try {
                if (dashboardUsers === null) {
                    setDashboardUsers(await apiClientProxy.get('/jemengage/users'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getDashboardUsers();
    }, []);

    return (
        <>
            {dashboardUsers !== null ? (
                <div className="with-background">
                    <div className="row p-3">
                        <span className="count-bubble">{dashboardUsers.users[dashboardUsers.users.length - 1].rolling_seven_users}</span>
                        <div className="col pl-0">
                            <div className="chart-title">Utilisateurs</div>
                            <div className="chart-subtitle">Actifs sur l&apos;application Je m&apos;engage</div>
                        </div>
                    </div>
                    <div className="row">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                data={dashboardUsers.users}
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
                                    style={{
                                        color: '#717BA0',
                                        fontFamily: 'roboto',
                                        fontSize: '12px',
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    style={{
                                        color: '#717BA0',
                                        fontFamily: 'roboto',
                                        fontSize: '12px',
                                    }}
                                />
                                <CartesianGrid strokeDasharray=".08" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#fff',
                                        borderColor: '#F0F1F3',
                                        borderRadius: '16px',
                                    }}
                                    labelStyle={{
                                        fontSize: '14px',
                                        color: '#1A334D',
                                        fontFamily: 'Poppins',
                                        fontWeight: 'bold',
                                        padding: '2px 5px',
                                        textAlign: 'left',
                                    }}
                                    itemStyle={{
                                        fontSize: '14px',
                                        fontFamily: 'Poppins',
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
            ) : <div className="text-center"><Loader /></div>}
        </>
    );
}

export default ActiveUsers;
