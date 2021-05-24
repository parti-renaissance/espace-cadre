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
        <div className="row with-background dc-container p-2 mb-3">
            <div className="col text-center">
                {dashboardAdherents !== null
                    ? <>La région {dashboardAdherents.zoneName} compte {dashboardAdherents.adherentCount} adhérents</>
                    : <div className="text-center"><Loader /></div>}
            </div>
        </div>
    );
}

export default TextChart;
