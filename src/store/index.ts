import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {eventsApi} from './api/eventsApi';
import interestedReducer from './slices/interestedSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    [eventsApi.reducerPath]: eventsApi.reducer,
    interested: interestedReducer,
    search: searchReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(eventsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

