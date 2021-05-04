/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';

import { updateTemplate } from './slice';
import { getTemplateContent } from './selectors';

export const useTemplateContent = () => {
    const dispatch = useDispatch();
    const content = useSelector(getTemplateContent);

    const setContent = (body) => {
        dispatch(updateTemplate(body));
    };

    return [content, setContent];
};
