import React, { useEffect } from 'react';
import Loader from '../../../Loader';
import { apiClientProxy } from '../../../../services/networking/client';
import { useDashboardAdherentCache } from '../../../../redux/dashboard/hooks';
import { useUserScope } from '../../../../redux/user/hooks';

function TextChart() {
    const [dashboardAdherents, setDashboardAdherents] = useDashboardAdherentCache();
    const [currentScope] = useUserScope();

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
    }, [dashboardAdherents]);

    return (
        <>
            {dashboardAdherents !== null
                ? <div className="headline-dashboard">{currentScope.name} &gt; {currentScope.zones && currentScope.zones.map((el, index) => `${index ? ', ' : ''} ${el.name}`)} ({dashboardAdherents.adherentCount} adhérent{dashboardAdherents.adherentCount > 1 && 's'})</div>
                : <Loader />}
        </>
    );
}

export default TextChart;
