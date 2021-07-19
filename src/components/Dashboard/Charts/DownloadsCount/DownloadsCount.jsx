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
import { useDashboardDownloadsCache } from '../../../../redux/dashboard/hooks';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useUserScope } from '../../../../redux/user/hooks';

function DownloadsCount() {
    const [dashboardDownloads, setDashboardDownloads] = useDashboardDownloadsCache();
    const [currentScope] = useUserScope();

    useEffect(() => {
        const getDownloads = async () => {
            try {
                if (dashboardDownloads === null && currentScope) {
                    setDashboardDownloads(await apiClientProxy.get('/jemengage/downloads'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getDownloads();
    }, [dashboardDownloads]);

    return (
        <>
            {dashboardDownloads !== null ? (
                <div className="with-background">
                    <div className="row p-3">
                        <span className="count-bubble">{dashboardDownloads.totalDownloads}</span>
                        <div className="col pl-0">
                            <div className="chart-title">Téléchargement{dashboardDownloads.downloads[dashboardDownloads.downloads.length - 1].cumsum > 1 && 's'} lors des 28 derniers jours</div>
                            <div className="chart-subtitle">De l&apos;application Je m&apos;engage sur les stores Android et Apple</div>
                        </div>
                    </div>
                    <div className="row">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                data={dashboardDownloads.downloads}
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
                                        borderRadius: '6px',
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
                        <li className="legend-chart" style={{ color: '#0049C6' }}>Téléchargements par jour </li>
                    </div>
                </div>
            ) : <div className="text-center"><Loader /></div>}
        </>
    );
}

export default DownloadsCount;
