/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import {
    getColumnsTitle,
    getGender,
    getFirstName,
    getLastName,
    getEmail,
    getPhone,
    getZipCode,
    getCommuneCode,
    getCommune,
    getDepartmentCode,
    getDepartment,
    getRegionCode,
    getRegion,
    getInterests,
    getContacts,
} from './selectors';
import {
    updateColumnsTitle,
    updateGender,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePhone,
    updateZipCode,
    updateCommuneCode,
    updateCommune,
    updateDepartmentCode,
    updateDepartment,
    updateRegionCode,
    updateRegion,
    updateInterests,
    updateContacts,
} from './slice';

export const useColumnsTitleCache = () => {
    const dispatch = useDispatch();

    const columnsTitle = useSelector(getColumnsTitle);

    const setColumnsTitle = (body) => dispatch(updateColumnsTitle(body));

    return [columnsTitle, setColumnsTitle];
};

export const useGenderCache = () => {
    const dispatch = useDispatch();

    const gender = useSelector(getGender);

    const setGender = (body) => dispatch(updateGender(body));

    return [gender, setGender];
};

export const useFirstNameCache = () => {
    const dispatch = useDispatch();

    const firstName = useSelector(getFirstName);

    const setFirstName = (body) => dispatch(updateFirstName(body));

    return [firstName, setFirstName];
};

export const useLastNameCache = () => {
    const dispatch = useDispatch();

    const lastName = useSelector(getLastName);

    const setLastName = (body) => dispatch(updateLastName(body));

    return [lastName, setLastName];
};

export const useEmailCache = () => {
    const dispatch = useDispatch();

    const email = useSelector(getEmail);

    const setEmail = (body) => dispatch(updateEmail(body));

    return [email, setEmail];
};

export const usePhoneCache = () => {
    const dispatch = useDispatch();

    const phone = useSelector(getPhone);

    const setPhone = (body) => dispatch(updatePhone(body));

    return [phone, setPhone];
};

export const useZipCodeCache = () => {
    const dispatch = useDispatch();

    const zipCode = useSelector(getZipCode);

    const setZipCode = (body) => dispatch(updateZipCode(body));

    return [zipCode, setZipCode];
};

export const useCommuneCache = () => {
    const dispatch = useDispatch();

    const commune = useSelector(getCommune);

    const setCommune = (body) => dispatch(updateCommune(body));

    return [commune, setCommune];
};

export const useCommuneCodeCache = () => {
    const dispatch = useDispatch();

    const communeCode = useSelector(getCommuneCode);

    const setCommuneCode = (body) => dispatch(updateCommuneCode(body));

    return [communeCode, setCommuneCode];
};

export const useDepartmentCodeCache = () => {
    const dispatch = useDispatch();

    const departmentCode = useSelector(getDepartmentCode);

    const setDepartmentCode = (body) => dispatch(updateDepartmentCode(body));

    return [departmentCode, setDepartmentCode];
};

export const useDepartmentCache = () => {
    const dispatch = useDispatch();

    const department = useSelector(getDepartment);

    const setDepartment = (body) => dispatch(updateDepartment(body));

    return [department, setDepartment];
};

export const useRegionCodeCache = () => {
    const dispatch = useDispatch();

    const regionCode = useSelector(getRegionCode);

    const setRegionCode = (body) => dispatch(updateRegionCode(body));

    return [regionCode, setRegionCode];
};

export const useRegionCache = () => {
    const dispatch = useDispatch();

    const region = useSelector(getRegion);

    const setRegion = (body) => dispatch(updateRegion(body));

    return [region, setRegion];
};

export const useInterestsCache = () => {
    const dispatch = useDispatch();

    const interests = useSelector(getInterests);

    const setInterests = (body) => dispatch(updateInterests(body));

    return [interests, setInterests];
};

export const useContactsCache = () => {
    const dispatch = useDispatch();

    const contacts = useSelector(getContacts);

    const setContacts = (body) => dispatch(updateContacts(body));

    return [contacts, setContacts];
};
