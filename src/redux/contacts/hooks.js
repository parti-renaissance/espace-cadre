/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getColumnsTitle, getContacts } from './selectors';
import { updateColumnsTitle, updateContacts } from './slice';

export const useColumnsTitleCache = () => {
    const dispatch = useDispatch();

    const columnsTitle = useSelector(getColumnsTitle);

    const setColumnsTitle = (body) => dispatch(updateColumnsTitle(body));

    return [columnsTitle, setColumnsTitle];
};

export const useContactsCache = () => {
    const dispatch = useDispatch();

    const contacts = useSelector(getContacts);

    const setContacts = (body) => dispatch(updateContacts(body));

    return [contacts, setContacts];
};
