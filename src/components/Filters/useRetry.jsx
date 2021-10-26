import { useRef, useState, useEffect } from 'react';

const useRetry = (f, duration, maxIteration) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const interval = useRef(null);
    const iteration = useRef(0);

    const clear = () => {
        clearInterval(interval.current);
    };

    useEffect(() => {
        if (data?.synchronized) {
            clear();
        }
    }, [data]);

    const launch = (...args) => {
        setLoading(true);
        setData(null);
        iteration.current = 0;
        interval.current = setInterval(async () => {
            const result = await f(...args);
            setData(result);
            setLoading(false);
            iteration.current += 1;
            if (iteration.current >= maxIteration) {
                clear();
            }
        }, duration);
    };

    return [loading, data, launch, clear];
};
export default useRetry;
