import { useState, useEffect } from 'react';

// 定义后端返回的数据接口
interface SensorData {
  timestamp: string;
  channel1: number;
  channel2: number;
  channel3: number;
  channel4: number;
  channel5: number;
  channel6: number;
  channel7: number;
  channel8: number;
}

// 定义脑波数据接口
export interface WaveData {
  alpha: number[];
  beta: number[];
  delta: number[];
  theta: number[];
}

// 从后端获取脑波分析数据
const fetchAnalysisData = async (): Promise<WaveData> => {
  try {
    const response = await fetch('http://localhost:3002/data/');
    if (!response.ok) {
      throw new Error('获取数据失败');
    }
    const data: SensorData[] = await response.json();

    // 将通道数据转换为脑波数据
    // 这里使用简单的映射关系，实际应该根据具体的分析算法来处理
    const processedData: WaveData = {
      // 使用不同通道的数据来模拟不同脑波
      alpha: data.map(item => Math.abs(item.channel1)), // FP1通道数据作为alpha波
      beta: data.map(item => Math.abs(item.channel2)),  // FP2通道数据作为beta波
      delta: data.map(item => Math.abs(item.channel3)), // F3通道数据作为delta波
      theta: data.map(item => Math.abs(item.channel4))  // F4通道数据作为theta波
    };

    return processedData;
  } catch (error) {
    console.error('获取脑波分析数据失败:', error);
    return {
      alpha: [],
      beta: [],
      delta: [],
      theta: []
    };
  }
};

// 获取脑波分析数据的自定义Hook
export const useAnalysisWaveData = (): WaveData => {
  const [waveData, setWaveData] = useState<WaveData>({
    alpha: [],
    beta: [],
    delta: [],
    theta: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取脑波分析数据
        const analysisData = await fetchAnalysisData();

        // 更新状态
        setWaveData(analysisData);
      } catch (error) {
        console.error('获取脑波分析数据失败:', error);
      }
    };

    // 首次加载数据
    fetchData();

    // 设置定时刷新（每10秒刷新一次）
    const intervalId = setInterval(fetchData, 10000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return waveData;
};

// 导出默认的脑波数据对象，用于直接引用
export const analysisWaveData: WaveData = {
  alpha: [],
  beta: [],
  delta: [],
  theta: []
};
