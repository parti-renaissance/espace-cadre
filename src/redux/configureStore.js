import { configureStore as reduxConfigureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, PERSIST } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReduxEnhancer } from '@sentry/react';

import rootReducer from './reducers';

const configureStore = () => {
    const persistConfig = {
        key: 'root',
        whitelist: ['auth', 'adherents'],
        storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = reduxConfigureStore({
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
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
