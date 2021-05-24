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
import { useDashboardDownloadsRatioCache } from '../../../../redux/dashboard/hooks';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';

function DownloadsRatios() {
    const [dashboardDownloadsRatio, setDashboardDownloadsRatio] = useDashboardDownloadsRatioCache();
    useEffect(() => {
        const getDownloads = async () => {
            try {
                if (dashboardDownloadsRatio === null) {
                    setDashboardDownloadsRatio(await apiClientProxy.get('/jemengage/downloadsRatios'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getDownloads();
    }, []);
    return (
        <>{dashboardDownloadsRatio !== null ? (
            <div>
                <div className="row p-3">
                    <span className="count-bubble">{dashboardDownloadsRatio.downloads[dashboardDownloadsRatio.downloads.length - 1].downloadsPer1000}</span>
                    <div className="col pl-0">
                        <div className="chart-title">Nombre de téléchargements pour 1000 adhérents</div>
                        <div className="chart-subtitle">De l&apos;application Je m&apos;engage sur les stores Android et Apple</div>
                    </div>
                </div>
                <div className="row">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            data={dashboardDownloadsRatio.downloads}
                            margin={{
                                top: 5, right: 20, bottom: 5, left: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorQuotidien" x1="0" y1="0" x2="0" y2="1">
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
                                name="Sur la région"
                                type="monotone"
                                dataKey="downloadsPer1000"
                                stroke="#0049C6"
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
                <div className="row">
                    <li className="legend-chart" style={{ color: '#0049C6' }}>Sur la région</li>
                    <li className="legend-chart" style={{ color: '#82ca9d' }}>Au national</li>
                </div>
            </div>
        ) : <div className="text-center"><Loader /></div>}
        </>
    );
}

export default DownloadsRatios;
