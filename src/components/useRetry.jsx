import { useRef, useState, useEffect } from 'react';

/**
 * useRetry will launch the f function, and look at the response.
 * If the response contains synchronized = false,
 * it will relaunch f a few milliseconds later (specified by the duration param).
 * If the reponse contains synchronized = true, it will run the option 'run' method
 * provided in the params.
 * The f function will be relaunch every 'duration' milliseconds until synchronized is true or
 * maxAttempts is reached.
 * If max attempts is reached, onError will be called
 * */
const useRetry = (f, duration, maxAttempts, run = () => {}, onError = () => {}) => {
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
            run()
        }
    }, [data, run]);

    const launch = (...args) => {
        setLoading(true);
        setData(null);
        iteration.current = 0;
        interval.current = setInterval(async () => {
            const result = await f(...args);
            setData(result);
            setLoading(false);
            iteration.current += 1;
            if (iteration.current >= maxAttempts) {
                clear();
                onError()
            }
        }, duration);
    };

    return [loading, data, launch, clear];
};
export default useRetry;
