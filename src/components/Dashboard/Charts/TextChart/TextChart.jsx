import React, { useState, useEffect } from 'react';
import Loader from '../../../Loader';
import { apiClientProxy } from '../../../../services/networking/client';
import { useDashboardAdherentCache } from '../../../../redux/dashboard/hooks';
import { useUserScope } from '../../../../redux/user/hooks';
import ErrorComponent from '../../../ErrorComponent/ErrorComponent';

function TextChart() {
    const [dashboardAdherents, setDashboardAdherents] = useDashboardAdherentCache();
    const [currentScope] = useUserScope();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getDashboardAdherents = async () => {
            try {
                if (dashboardAdherents === null && currentScope) {
                    setDashboardAdherents(await apiClientProxy.get('/adherents'));
                }
            } catch (error) {
                setHasError(true);
                setErrorMessage(error);
            }
        };
        getDashboardAdherents();
    }, [dashboardAdherents]);

    const dashboardAdherentsContent = () => {
        if (dashboardAdherents !== null) {
            return (
                <div className="headline-dashboard">{currentScope.name} &gt;
                    {currentScope.zones && currentScope.zones.map((el, index) => `${index ? ', ' : ''} ${el.name}`)} ({dashboardAdherents.adherentCount} adhérent{dashboardAdherents.adherentCount > 1 && 's'})
                </div>
            );
        } if (hasError) {
            return (
                <ErrorComponent errorMessage={errorMessage} />
            );
        }
        return <Loader />;
    };

    return (
        <>
            {dashboardAdherentsContent()}
        </>
    );
}

export default TextChart;
