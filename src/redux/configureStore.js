import { configureStore as reduxConfigureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReduxEnhancer } from '@sentry/react';

import { PERSIST } from 'redux-persist/es/constants';
import rootReducer from './reducers';

const configureStore = () => {
    const persistConfig = {
        key: 'root',
        whitelist: ['auth'],
        storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = reduxConfigureStore({
        devTools: process.env.NODE_ENV !== 'production',
        middleware: getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [PERSIST], // see https://github.com/rt2zz/redux-persist/issues/988#issuecomment-529575333
            },
        }),
        reducer: persistedReducer,
        enhancers: [createReduxEnhancer()],
    });

    const persistor = persistStore(store);

    return { store, persistor };
};

export default configureStore;
