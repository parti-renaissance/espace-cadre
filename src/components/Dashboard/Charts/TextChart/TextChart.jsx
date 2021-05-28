import React, { useEffect } from 'react';
import Loader from '../../../Loader';
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
                ? <div className="headline-dashboard">Candidat &gt; {dashboardAdherents.zoneName} ({dashboardAdherents.adherentCount} adhérents)</div>
                : <div><Loader /></div>}
        </>
    );
}

export default TextChart;
