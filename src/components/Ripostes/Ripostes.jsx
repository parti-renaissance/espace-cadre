import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/networking/client';

function Ripostes() {
    const [rispostesItems, setRispostesItems] = useState();

    useEffect(() => {
        const getRipostes = async () => {
            const ripostesData = await apiClient.get('api/v3/ripostes');
            setRispostesItems(ripostesData);
        };

        getRipostes();
    }, []);

    useEffect(() => {
        console.log(rispostesItems);
    }, []);
    return (
        <div>
            Ripostes
        </div>
    );
}

export default Ripostes;
