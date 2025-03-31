import { useState, useEffect, useRef } from 'react';

// 定义后端返回的数据接口
interface SpectrumData {
  timestamp: string;
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
}

// 定义脑波数据接口
export interface WaveData {
  timestamp: string;
  alpha: number[];
  beta: number[];
  delta: number[];
  theta: number[];
}

// 从后端获取脑波分析数据
const fetchAnalysisData = async (): Promise<SpectrumData[]> => {
  try {
    const response = await fetch('http://120.55.124.106:8085/spectrum/');
    if (!response.ok) {
      throw new Error('获取数据失败');
    }
    const data: SpectrumData[] = await response.json();
    return data;
  } catch (error) {
    console.error('获取脑波分析数据失败:', error);
    return [];
  }
};

// 获取脑波分析数据的自定义Hook
export const useAnalysisWaveData = (isConnected?: boolean): WaveData => {
  const [waveData, setWaveData] = useState<WaveData>({
    timestamp: '',
    alpha: [],
    beta: [],
    delta: [],
    theta: []
  });

  // 使用ref存储累积的数据
  const dataRef = useRef<{
    alpha: number[];
    beta: number[];
    delta: number[];
    theta: number[];
    lastTimestamp: string;
  }>({
    alpha: [],
    beta: [],
    delta: [],
    theta: [],
    lastTimestamp: ''
  });

  // 最大保存的数据点数量
  const MAX_DATA_POINTS = 50;

  useEffect(() => {
    // 如果isConnected为false或undefined，不获取数据
    if (!isConnected) {
      return;
    }

    const fetchData = async () => {
      try {
        // 获取脑波分析数据
        const spectrumData = await fetchAnalysisData();

        if (spectrumData.length === 0) {
          return;
        }

        // 累积数据处理
        const currentData = { ...dataRef.current };

        // 处理每个新数据点
        spectrumData.forEach(item => {
          // 只添加新的数据点（根据时间戳判断）
          if (item.timestamp !== currentData.lastTimestamp) {
            currentData.alpha.push(item.alpha);
            currentData.beta.push(item.beta);
            currentData.delta.push(item.delta);
            currentData.theta.push(item.theta);
            currentData.lastTimestamp = item.timestamp;
          }
        });

        // 保持数据在最大长度以内（使用滑动窗口）
        if (currentData.alpha.length > MAX_DATA_POINTS) {
          currentData.alpha = currentData.alpha.slice(-MAX_DATA_POINTS);
          currentData.beta = currentData.beta.slice(-MAX_DATA_POINTS);
          currentData.delta = currentData.delta.slice(-MAX_DATA_POINTS);
          currentData.theta = currentData.theta.slice(-MAX_DATA_POINTS);
        }

        // 更新引用数据
        dataRef.current = currentData;

        // 更新状态
        setWaveData({
          timestamp: spectrumData[spectrumData.length - 1].timestamp,
          alpha: [...currentData.alpha],
          beta: [...currentData.beta],
          delta: [...currentData.delta],
          theta: [...currentData.theta]
        });
      } catch (error) {
        console.error('获取脑波分析数据失败:', error);
      }
    };

    // 首次加载数据
    fetchData();

    // 设置定时刷新（每5秒刷新一次）
    const intervalId = setInterval(fetchData, 5000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected]);

  return waveData;
};

// 导出默认的脑波数据对象，用于直接引用
export const analysisWaveData: WaveData = {
  timestamp: '',
  alpha: [],
  beta: [],
  delta: [],
  theta: []
};
