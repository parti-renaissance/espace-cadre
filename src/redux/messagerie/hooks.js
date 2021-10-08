/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';

import {
    resetMessagerieState, updateMessageSubject, updateMessageTemplate, updateRemoteMessage,
} from './slice';
import { getMessageSubject, getMessageTemplate, getRemoteMessage } from './selectors';

export const useMessageTemplate = () => {
    const dispatch = useDispatch();

    return [
        useSelector(getMessageTemplate),
        (template) => {
            dispatch(updateMessageTemplate(template));
        },
    ];
};

export const useMessageSubject = () => {
    const dispatch = useDispatch();

    return [
        useSelector(getMessageSubject),
        (value) => {
            dispatch(updateMessageSubject(value));
        },
    ];
};

export const useRemoteMessage = () => {
    const dispatch = useDispatch();

    return [
        useSelector(getRemoteMessage),
        (value) => {
            dispatch(updateRemoteMessage(value));
        },
    ];
};

export const useResetMessagerieState = () => {
    const dispatch = useDispatch();

    return () => dispatch(resetMessagerieState());
};
