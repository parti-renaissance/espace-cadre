/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';

import {
    resetMessagerieState, updateMessageSubject, updateMessageTemplate, updateRemoteMessage, updateSelectedTemplate,
} from './slice';
import {
    getMessageSubject, getMessageTemplate, getRemoteMessage, getSelectedTemplate,
} from './selectors';
import { apiClient } from '../../services/networking/client';

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

export const useSelectedTemplate = () => {
    const dispatch = useDispatch();

    return [
        useSelector(getSelectedTemplate),
        async (option) => {
            if (option?.value) {
                const templateContent = await apiClient.get(`/v3/email_templates/${option.value}`);

                dispatch(updateSelectedTemplate({ ...option, ...templateContent }));
                dispatch(updateMessageTemplate({
                    design: JSON.parse(templateContent.content),
                    skipReloadUnlayer: false,
                }));
            } else {
                dispatch(updateSelectedTemplate(option));
            }
        },
    ];
};

export const useResetMessagerieState = () => {
    const dispatch = useDispatch();

    return () => dispatch(resetMessagerieState());
};
