import { useRef, useState, useEffect } from 'react';

const useRetry = (f, duration, maxIteration) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const interval = useRef(null);
    const iteration = useRef(0);

    const clear = () => {
        clearInterval(interval.current);
    };

    useEffect(() => {
        setLoading(!data?.synchronized);
        if (data?.synchronized) {
            clear();
        }
    }, [data]);

    const go = (...args) => {
        setLoading(true);
        setData(null);
        iteration.current = 0;
        interval.current = setInterval(async () => {
            const result = await f(...args);
            setData(result);
            iteration.current += 1;
            if (iteration.current >= maxIteration) {
                clear();
            }
        }, duration);
    };

    return [loading, data, go, clear];
};
export default useRetry;
