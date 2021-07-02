import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../../Loader';
import { apiClientProxy } from '../../../../services/networking/client';
import { useDashboardAdherentCache } from '../../../../redux/dashboard/hooks';
import {
    getCurrentScope,
} from '../../../../redux/user/selectors';

function TextChart() {
    const [dashboardAdherents, setDashboardAdherents] = useDashboardAdherentCache();
    const currentScope = useSelector(getCurrentScope);

    useEffect(() => {
        const getDashboardAdherents = async () => {
            try {
                if (dashboardAdherents === null) {
                    const encodedScope = btoa(JSON.stringify(currentScope));
                    setDashboardAdherents(await apiClientProxy.get(`/adherents?scope=${encodedScope}`));
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
                : <Loader />}
        </>
    );
}

export default TextChart;
