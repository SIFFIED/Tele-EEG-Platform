import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { WaveData } from '../services/analysisWaveData';

interface TimeFrequencyChartProps {
  data: WaveData;
  currentIndex: number;
  isPlaying: boolean;
}

const TimeFrequencyChart: React.FC<TimeFrequencyChartProps> = ({
  data,
  currentIndex,
  isPlaying
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 将波形数据转换为热力图数据
  const transformData = (waveData: WaveData, currentIdx: number) => {
    const waveTypes = ['alpha', 'beta', 'delta', 'theta'];
    const displayData: Array<[number, number, number]> = [];

    // 只处理到当前播放位置的数据
    const endIndex = isPlaying ? currentIdx : waveData.alpha.length;

    for (let timeIndex = 0; timeIndex <= endIndex; timeIndex++) {
      waveTypes.forEach((waveType, waveIndex) => {
        const value = waveData[waveType as keyof WaveData][timeIndex];
        if (typeof value === 'number') {
          // 将值标准化到0-1之间
          const normalizedValue = Math.abs(value);
          displayData.push([timeIndex, waveIndex, normalizedValue]);
        }
      });
    }

    return displayData;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: '时频分析热力图',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const waveTypes = ['Alpha', 'Beta', 'Delta', 'Theta'];
          const time = params.data[0];
          const waveType = waveTypes[params.data[1]];
          const value = params.data[2].toFixed(3);
          return `时间: ${time}ms<br/>${waveType}波: ${value}`;
        }
      },
      grid: {
        left: '15%',
        right: '15%',
        top: '15%',
        bottom: '20%'
      },
      xAxis: {
        type: 'category',
        name: '时间(ms)',
        nameLocation: 'middle',
        nameGap: 35,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        name: '脑波类型',
        nameLocation: 'middle',
        nameGap: 40,
        data: ['Alpha', 'Beta', 'Delta', 'Theta'],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 3,
        calculable: true,
        orient: 'vertical',
        right: '0%',
        top: 'center',
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
            '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: '时频分析',
        type: 'heatmap',
        data: transformData(data, currentIndex),
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }],
      animation: false
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data, currentIndex, isPlaying]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TimeFrequencyChart; 