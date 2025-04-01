import React, { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPlaybackSpeed,
  startPlayback,
  stopPlayback,
  setData
} from '../redux/waveChartSlice';
import { RootState } from '../redux/store';

interface WaveData {
  alpha: number[];
  beta: number[];
  delta: number[];
  theta: number[];
}

// 更新接口，仅需传入data属性
interface WaveChartControllerProps {
  data: WaveData;
}

const WaveChartController: React.FC<WaveChartControllerProps> = ({ data }) => {
  // 使用Redux hooks获取状态
  const dispatch = useDispatch();
  const { isPlaying, currentIndex, playbackSpeed } = useSelector(
    (state: RootState) => state.waveChart
  );

  const alphaChartRef = useRef<HTMLDivElement>(null);
  const betaChartRef = useRef<HTMLDivElement>(null);
  const deltaChartRef = useRef<HTMLDivElement>(null);
  const thetaChartRef = useRef<HTMLDivElement>(null);

  const chartInstancesRef = useRef<{
    alpha: echarts.ECharts | null;
    beta: echarts.ECharts | null;
    delta: echarts.ECharts | null;
    theta: echarts.ECharts | null;
  }>({
    alpha: null,
    beta: null,
    delta: null,
    theta: null
  });

  // 初始化图表
  const initChart = useCallback((
    container: HTMLDivElement,
    name: string,
    color: string
  ): echarts.ECharts => {
    const chart = echarts.init(container);
    const option = {
      title: {
        text: `${name}波功率谱`,
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = params[0].dataIndex;
          const value = params[0].value;
          return `时间: ${time}ms<br/>功率: ${value.toFixed(2)}μV²`;
        }
      },
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        name: '时间(ms)',
        nameLocation: 'middle',
        nameGap: 25,
        data: [],
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'value',
        name: '功率(μV²)',
        nameLocation: 'middle',
        nameGap: 35
      },
      series: [
        {
          name: name,
          type: 'line',
          showSymbol: false,
          data: [],
          lineStyle: {
            color: color
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: color.replace('1)', '0.6)')
              },
              {
                offset: 1,
                color: color.replace('1)', '0.1)')
              }
            ])
          }
        }
      ],
      animation: false
    };
    chart.setOption(option);
    return chart;
  }, []);

  // 更新图表数据
  const updateChartData = useCallback((
    chart: echarts.ECharts | null,
    data: number[],
    currentIndex: number
  ) => {
    if (!chart) return;

    const displayData = data.slice(0, currentIndex + 1);
    const timeData = Array.from({ length: currentIndex + 1 }, (_, i) => i);

    chart.setOption({
      xAxis: {
        data: timeData
      },
      series: [{
        data: displayData
      }]
    });
  }, []);

  // 初始化所有图表
  useEffect(() => {
    if (!alphaChartRef.current || !betaChartRef.current ||
      !deltaChartRef.current || !thetaChartRef.current) return;

    chartInstancesRef.current = {
      alpha: initChart(alphaChartRef.current, 'Alpha', 'rgba(59, 130, 246, 1)'),
      beta: initChart(betaChartRef.current, 'Beta', 'rgba(239, 68, 68, 1)'),
      delta: initChart(deltaChartRef.current, 'Delta', 'rgba(16, 185, 129, 1)'),
      theta: initChart(thetaChartRef.current, 'Theta', 'rgba(245, 158, 11, 1)')
    };

    const handleResize = () => {
      Object.values(chartInstancesRef.current).forEach(chart => {
        chart?.resize();
      });
    };

    window.addEventListener('resize', handleResize);

    // 直接使用已导入的setData action
    dispatch(setData(data));

    return () => {
      window.removeEventListener('resize', handleResize);
      Object.values(chartInstancesRef.current).forEach(chart => {
        chart?.dispose();
      });
    };
  }, [initChart, data, dispatch]);

  // 更新所有图表数据
  useEffect(() => {
    const { alpha, beta, delta, theta } = chartInstancesRef.current;
    updateChartData(alpha, data.alpha, currentIndex);
    updateChartData(beta, data.beta, currentIndex);
    updateChartData(delta, data.delta, currentIndex);
    updateChartData(theta, data.theta, currentIndex);
  }, [currentIndex, data, updateChartData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={playbackSpeed}
            onChange={(e) => dispatch(setPlaybackSpeed(Number(e.target.value)))}
            disabled={isPlaying}
          >
            <option value="200">0.5x 速度</option>
            <option value="100">1x 速度</option>
            <option value="50">2x 速度</option>
          </select>
          <button
            className={`px-4 py-1 rounded text-white text-sm ${isPlaying
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
              }`}
            onClick={() => dispatch(isPlaying ? stopPlayback() : startPlayback())}
          >
            {isPlaying ? '停止' : '播放'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-64 bg-gray-50 rounded-lg p-2">
          <div ref={alphaChartRef} className="w-full h-full" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg p-2">
          <div ref={betaChartRef} className="w-full h-full" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg p-2">
          <div ref={deltaChartRef} className="w-full h-full" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg p-2">
          <div ref={thetaChartRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default WaveChartController;