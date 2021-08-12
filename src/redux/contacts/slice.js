import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    columnsTitle: [],
    contacts: [],
    gender: {},
    firstName: {},
    lastName: {},
    email: { subscribedEmail: '' },
    phone: { subscribedPhone: '' },
    zipCode: {},
    communeCode: {},
    commune: {},
    departmentCode: {},
    department: {},
    regionCode: {},
    region: {},
    interests: [],
};

const dashboardSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        updateColumnsTitle(state, action) {
            state.columnsTitle = action.payload;
        },
        updateGender(state, action) {
            state.gender = action.payload;
        },
        updateFirstName(state, action) {
            state.firstName = action.payload;
        },
        updateLastName(state, action) {
            state.lastName = action.payload;
        },
        updateEmail(state, action) {
            state.email = action.payload;
        },
        updatePhone(state, action) {
            state.phone = action.payload;
        },
        updateZipCode(state, action) {
            state.zipCode = action.payload;
        },
        updateCommuneCode(state, action) {
            state.communeCode = action.payload;
        },
        updateCommune(state, action) {
            state.commune = action.payload;
        },
        updateDepartmentCode(state, action) {
            state.departmentCode = action.payload;
        },
        updateDepartment(state, action) {
            state.department = action.payload;
        },
        updateRegionCode(state, action) {
            state.regionCode = action.payload;
        },
        updateRegion(state, action) {
            state.region = action.payload;
        },
        updateInterests(state, action) {
            state.interests = action.payload;
        },
        updateContacts(state, action) {
            state.contacts = action.payload;
        },
        resetContactsState() {
            return initialState;
        },
    },
});

export const {
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
    resetContactsState,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
