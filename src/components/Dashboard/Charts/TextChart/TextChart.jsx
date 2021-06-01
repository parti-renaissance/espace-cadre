import React, { useEffect } from 'react';
import OneLineLoader from '../../../Loaders/OneLineLoader';
import { apiClientProxy } from '../../../../services/networking/client';
import { useDashboardAdherentCache } from '../../../../redux/dashboard/hooks';

function TextChart() {
    const [dashboardAdherents, setDashboardAdherents] = useDashboardAdherentCache();

    useEffect(() => {
        const getDashboardAdherents = async () => {
            try {
                if (dashboardAdherents === null) {
                    setDashboardAdherents(await apiClientProxy.get('/adherents'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getDashboardAdherents();
    }, []);

    return (
        <>
            {dashboardAdherents !== null
                ? <div className="headline-dashboard">Candidat &gt; {dashboardAdherents.zoneName} ({dashboardAdherents.adherentCount} adhérent{dashboardAdherents.adherentCount > 1 && 's'})</div>
                : <OneLineLoader /> }
        </>
    );
}

export default TextChart;
