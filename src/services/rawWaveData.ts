import { useState, useEffect, useRef } from 'react';

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

// 定义原始脑电数据接口
export interface RawBrainwaveData {
  FP1: number[];
  FP2: number[];
  F3: number[];
  F4: number[];
  C3: number[];
  C4: number[];
  O1: number[];
  O2: number[];
  timestamps: string[];
  [key: string]: any; // 允许其他属性
}

// 定义数据项接口
interface BrainwaveDataItem {
  channelId: string;
  value: number;
  timestamp: string;
}

// 最大数据点数量
const MAX_DATA_POINTS = 50;

// 从后端获取原始脑电数据
const fetchRawBrainwaveData = async (): Promise<BrainwaveDataItem[]> => {
  try {
    // 使用实际后端API
    const response = await fetch('http://120.55.124.106:8085/data/');//http://120.55.124.106:8085/data/
    if (!response.ok) {
      throw new Error('获取数据失败');
    }
    const data: SensorData[] = await response.json();

    // 将后端数据转换为前端需要的格式
    const transformedData: BrainwaveDataItem[] = [];

    // 添加当前时间作为时间戳
    const now = new Date();
    const currentTimeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

    // 只处理最新的数据点
    if (data.length > 0) {
      const latestData = data[data.length - 1];
      // 为每个通道添加最新的数据点
      transformedData.push({ channelId: 'FP1', value: latestData.channel1, timestamp: currentTimeString });
      transformedData.push({ channelId: 'FP2', value: latestData.channel2, timestamp: currentTimeString });
      transformedData.push({ channelId: 'F3', value: latestData.channel3, timestamp: currentTimeString });
      transformedData.push({ channelId: 'F4', value: latestData.channel4, timestamp: currentTimeString });
      transformedData.push({ channelId: 'C3', value: latestData.channel5, timestamp: currentTimeString });
      transformedData.push({ channelId: 'C4', value: latestData.channel6, timestamp: currentTimeString });
      transformedData.push({ channelId: 'O1', value: latestData.channel7, timestamp: currentTimeString });
      transformedData.push({ channelId: 'O2', value: latestData.channel8, timestamp: currentTimeString });
    }

    return transformedData;
  } catch (error) {
    console.error('获取原始脑电数据失败:', error);
    return [];
  }
};

// 获取原始脑电数据的自定义Hook
export const useRawBrainwaveData = (refreshInterval?: number): RawBrainwaveData => {
  const [rawData, setRawData] = useState<RawBrainwaveData>({
    FP1: [],
    FP2: [],
    F3: [],
    F4: [],
    C3: [],
    C4: [],
    O1: [],
    O2: [],
    timestamps: []
  });

  // 添加一个状态来跟踪是否正在获取数据
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // 添加一个引用来存储当前数据
  const currentDataRef = useRef<RawBrainwaveData>(rawData);

  useEffect(() => {
    // 如果refreshInterval未定义或为0，表示不需要获取数据
    if (refreshInterval === undefined || refreshInterval <= 0) {
      return;
    }

    const fetchData = async () => {
      // 如果正在获取数据，则跳过
      if (isFetching) return;

      try {
        setIsFetching(true);

        // 获取脑电数据
        const brainwaveRawData = await fetchRawBrainwaveData();

        // 如果没有数据，则跳过
        if (brainwaveRawData.length === 0) {
          setIsFetching(false);
          return;
        }

        // 按通道ID分组处理数据
        const groupedData: { [key: string]: number[] } = {
          FP1: [],
          FP2: [],
          F3: [],
          F4: [],
          C3: [],
          C4: [],
          O1: [],
          O2: []
        };

        // 收集时间戳
        const timestamps: string[] = [];
        const timestampSet = new Set<string>();

        // 将数据按通道分组并收集唯一的时间戳
        brainwaveRawData.forEach(item => {
          if (groupedData[item.channelId]) {
            groupedData[item.channelId].push(item.value);

            // 只为每个唯一的时间戳添加一次
            if (!timestampSet.has(item.timestamp)) {
              timestampSet.add(item.timestamp);
              timestamps.push(item.timestamp);
            }
          }
        });

        // 获取当前数据
        const currentData = { ...currentDataRef.current };

        // 更新数据数组，保持最多50个数据点
        const updatedData: RawBrainwaveData = {
          FP1: [],
          FP2: [],
          F3: [],
          F4: [],
          C3: [],
          C4: [],
          O1: [],
          O2: [],
          timestamps: []
        };

        // 对每个通道应用滑动窗口
        Object.keys(groupedData).forEach(key => {
          if (groupedData[key].length > 0) {
            // 合并现有数据和新数据
            const combinedData = [...currentData[key], ...groupedData[key]];
            // 如果数据超过MAX_DATA_POINTS，只保留最后MAX_DATA_POINTS个点
            updatedData[key] = combinedData.slice(-MAX_DATA_POINTS);
          } else {
            // 如果没有新数据，保留现有数据的最后MAX_DATA_POINTS个点
            updatedData[key] = currentData[key].slice(-MAX_DATA_POINTS);
          }
        });

        // 更新时间戳，保持与数据点数量一致
        const combinedTimestamps = [...currentData.timestamps, ...timestamps];
        updatedData.timestamps = combinedTimestamps.slice(-MAX_DATA_POINTS);

        // 更新当前数据引用
        currentDataRef.current = updatedData;

        // 更新状态
        setRawData(updatedData);
        setIsFetching(false);
      } catch (error) {
        console.error('获取原始脑电数据失败:', error);
        setIsFetching(false);
      }
    };

    // 首次加载数据
    fetchData();

    // 设置定时刷新，每秒获取一次新数据
    const intervalId = setInterval(fetchData, refreshInterval);

    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return rawData;
};

// 导出默认的原始脑电数据对象，用于直接引用
export const rawBrainwaveData: RawBrainwaveData = {
  FP1: [],
  FP2: [],
  F3: [],
  F4: [],
  C3: [],
  C4: [],
  O1: [],
  O2: [],
  timestamps: []
};
