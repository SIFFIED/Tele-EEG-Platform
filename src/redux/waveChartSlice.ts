import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WaveData {
  alpha: number[];
  beta: number[];
  delta: number[];
  theta: number[];
}

interface WaveChartState {
  data: WaveData;
  isPlaying: boolean;
  currentIndex: number;
  playbackSpeed: number;
}

const initialState: WaveChartState = {
  data: { alpha: [], beta: [], delta: [], theta: [] },
  isPlaying: false,
  currentIndex: 0,
  playbackSpeed: 100 // 默认速度
};

const waveChartSlice = createSlice({
  name: 'waveChart',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<WaveData>) => {
      state.data = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    },
    startPlayback: (state) => {
      state.isPlaying = true;
      state.currentIndex = 0;
    },
    stopPlayback: (state) => {
      state.isPlaying = false;
      state.currentIndex = 0;
    },
    incrementIndex: (state) => {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.data.alpha.length - 1) {
        state.isPlaying = false;
      } else {
        state.currentIndex = nextIndex;
      }
    }
  }
});

export const {
  setData,
  setIsPlaying,
  setCurrentIndex,
  setPlaybackSpeed,
  startPlayback,
  stopPlayback,
  incrementIndex
} = waveChartSlice.actions;
export default waveChartSlice.reducer;