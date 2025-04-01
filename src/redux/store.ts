import { configureStore } from '@reduxjs/toolkit';
import waveChartReducer from './waveChartSlice';
import { playbackMiddleware } from './playbackMiddleware';

export const store = configureStore({
  reducer: {
    waveChart: waveChartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(playbackMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 