import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// 定义通道名称类型
type ChannelName = 'FP1' | 'FP2' | 'F3' | 'F4' | 'C3' | 'C4' | 'O1' | 'O2';
// 定义通道可见性类型
type ChannelVisibility = {
  [key in ChannelName]: boolean;
};
// 定义BrainwaveChartProps接口
interface BrainwaveChartProps {
  data: {
    FP1: number[];
    FP2: number[];
    F3: number[];
    F4: number[];
    C3: number[];
    C4: number[];
    O1: number[];
    O2: number[];
    timestamps?: string[];
    [key: string]: any; // 允许其他属性
  };
  refreshInterval?: number;
}

// 格式化时间戳为更友好的显示格式
const formatTimestamp = (timestamp: string): string => {
  // 直接返回时间戳，与copy_index.vue保持一致
  return timestamp;
};

const BrainwaveChart: React.FC<BrainwaveChartProps> = ({ data, refreshInterval = 1000 }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 所有通道始终可见，不再需要状态管理
  const visibleChannels: ChannelVisibility = {
    'FP1': true,
    'FP2': true,
    'F3': true,
    'F4': true,
    'C3': true,
    'C4': true,
    'O1': true,
    'O2': true
  };

  // 每次数据更新时重新渲染图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 获取时间戳数据
    const timestamps = data.timestamps || [];
    const timeLabels = timestamps.map(formatTimestamp);

    // 如果没有时间戳，则使用索引作为X轴
    const useTimeIndex = timestamps.length === 0;

    // 定义通道的数据
    const channels = Object.keys(data)
      .filter(key => key !== 'timestamps' && key in visibleChannels)
      .map(key => ({
        name: key as ChannelName,
        data: data[key].map((value: number, i: number) => {
          return [i, value];
        })
      }));

    // 计算每个通道的垂直偏移量
    const offset = 1000;
    const visibleChannelsArray = channels.filter(channel =>
      Object.prototype.hasOwnProperty.call(visibleChannels, channel.name) &&
      visibleChannels[channel.name]
    );
    const isSingleChannel = visibleChannelsArray.length === 1;

    const series = visibleChannelsArray
      .map((channel, index) => ({
        name: channel.name,
        type: 'line',
        showSymbol: false,
        data: channel.data.map((item: [number, number]) => [item[0], item[1] + (isSingleChannel ? 0 : index * offset)]),
        lineStyle: {
          width: 1
        },
        emphasis: {
          lineStyle: {
            width: 2
          }
        }
      }));

    // 图表配置选项
    const option = {
      grid: {
        left: '15%',
        right: '8%',
        top: '5%',
        bottom: '8%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          if (!Array.isArray(params)) {
            return '';
          }

          const index = params[0]?.dataIndex;
          if (index === undefined) {
            return '';
          }
   //要修改成当前时间
          const timeDisplay = useTimeIndex
            ? `时间: ${index}ms`
            : `时间: ${timestamps[index] ? formatTimestamp(timestamps[index]) : index}`;

          return `${timeDisplay}<br/>` +
            params.map((param: any) => {
              if (!param || !param.seriesName || !param.data || !Array.isArray(param.data)) {
                return '';
              }

              const channelIndex = parseInt(param.seriesIndex);
              if (isNaN(channelIndex)) {
                return '';
              }

              const value = param.data[1];
              if (typeof value !== 'number') {
                return '';
              }

              const actualValue = value - (channelIndex * offset);
              return `${param.seriesName}: ${actualValue.toFixed(2)}μV`;
            }).join('<br/>');
        }
      },
      legend: isSingleChannel ? undefined : {
        data: visibleChannelsArray.map(channel => channel.name),
        orient: 'vertical',
        left: 10,
        top: 'center',
        itemWidth: 15,
        itemHeight: 10,
        textStyle: {
          fontSize: 12
        }
      },
      xAxis: {
        type: 'category',
        name: '时间',
        nameLocation: 'middle',
        nameGap: 25,
        boundaryGap: false, // 移除边界间隙，使图表紧贴边缘
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        data: useTimeIndex ? Array.from({ length: data.FP1.length }, (_, i) => i) : timeLabels,
        axisLabel: {
          rotate: useTimeIndex ? 0 : 45,
          interval: useTimeIndex ? 'auto' : function (index: number) {
            // 每5个点显示一个标签
            return index % 5 === 0;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '电压(μV)',
        nameLocation: 'middle',
        nameGap: 35,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLabel: {
          show: false,
          margin: 12
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        },
        interval: isSingleChannel ? null : null,
        min: isSingleChannel ? -500 : -500,
        max: isSingleChannel ? 500 : (visibleChannelsArray.length - 1) * offset + 500,
        splitNumber: isSingleChannel ? 7 : 10,
        splitArea: {
          show: false
        }
      },
      series,
      animation: false,
      // 添加数据缩放组件
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          minValueSpan: 10 // 最小缩放范围为10个数据点
        }
      ]
    };

    // 如果是多通道模式，添加自定义Y轴刻度
    if (!isSingleChannel) {
      // 为每个通道添加一个刻度点
      (option.yAxis as any).axisPointer = {
        show: true,
        label: {
          show: false // 隐藏轴指示器标签
        }
      };

      // 添加自定义刻度位置
      (option.yAxis as any).axisTick = {
        show: true,
        interval: function (index: number, value: number) {
          if (typeof value !== 'number') {
            return false;
          }

          // 为每个通道的关键刻度点添加刻度线
          for (let i = 0; i < visibleChannelsArray.length; i++) {
            const relativeValue = Math.round(value - i * offset);
            if (Math.abs(relativeValue) <= 500 && relativeValue % 100 === 0) {
              return true;
            }
          }
          return false;
        }
      };
    }

    // 添加辅助线，显示每个通道的基线位置
    const markLines = visibleChannelsArray.map((channel, index) => ({
      silent: true,
      symbol: 'none',
      lineStyle: {
        color: '#999',
        type: 'dashed',
        width: 1
      },
      data: [
        {
          yAxis: index * offset,
          name: channel.name,
          label: {
            show: true,
            position: 'insideEndTop',
            formatter: channel.name,
            fontSize: 12,
            color: '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: [2, 4],
            borderRadius: 2
          }
        }
      ]
    }));

    // 将辅助线添加到每个系列中
    option.series = option.series.map((series: any, index: number) => ({
      ...series,
      markLine: markLines[index]
    }));

    // 直接设置选项，不使用合并模式
    chartInstance.current.setOption(option, true);

    // 添加控制按钮
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default BrainwaveChart; 