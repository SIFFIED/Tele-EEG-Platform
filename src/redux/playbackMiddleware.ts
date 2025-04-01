import { incrementIndex } from './waveChartSlice';
import { RootState } from './store';

let intervalId: NodeJS.Timeout | null = null;

// 使用更简单的方式来定义中间件
export const playbackMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  if (action.type === 'waveChart/setIsPlaying' ||
    action.type === 'waveChart/startPlayback' ||
    action.type === 'waveChart/stopPlayback' ||
    action.type === 'waveChart/setPlaybackSpeed') {

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    // 使用类型断言确保TypeScript不会报错
    const state = store.getState() as RootState;
    const { isPlaying, playbackSpeed } = state.waveChart;

    if (isPlaying) {
      intervalId = setInterval(() => {
        store.dispatch(incrementIndex());
      }, playbackSpeed);
    }
  }

  return result;
};