/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getContacts } from './selectors';
import { updateContacts } from './slice';

export const useContactsCache = () => {
    const dispatch = useDispatch();

    const contacts = useSelector(getContacts);

    const setContacts = (body) => dispatch(updateContacts(body));

    return [contacts, setContacts];
};
