/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getColumnsTitle } from './selectors';
import { updateColumnsTitle } from './slice';

export const useColumnsTitleCache = () => {
    const dispatch = useDispatch();

    const columnsTitle = useSelector(getColumnsTitle);

    const setColumnsTitle = (body) => dispatch(updateColumnsTitle(body));

    return [columnsTitle, setColumnsTitle];
};
