import React, { useState, useEffect } from 'react';
import './App.css';
import {
  ElectrodeMap,
  SignalQualityMap
} from './components/DummyImages';
import BrainwaveChart from './components/BrainwaveChart';
import WaveChartController from './components/WaveChartController';
import TimeFrequencyChart from './components/TimeFrequencyChart';
import { useAnalysisWaveData } from './services/analysisWaveData';
import { useRawBrainwaveData } from './services/rawWaveData';


function App() {
  const [activeTab, setActiveTab] = useState('rawData');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceData, setDeviceData] = useState({
    name: '未知设备',
    model: '未知型号',
    status: '未知状态',
    startTime: '未知开始时间',
    endTime: '未知结束时间'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  // 添加播放控制状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 设备数据表格
  const [rawDataTable, setRawDataTable] = useState([
    {
      id: '01',
      name: 'BrainAmp DC',
      model: 'DC-2020-A',
      samplingRate: '512Hz',
      channels: 32
    },
    {
      id: '02',
      name: 'BrainAmp MR',
      model: 'MR-2020-B',
      samplingRate: '1024Hz',
      channels: 64
    },
    {
      id: '03',
      name: 'actiCHamp Plus',
      model: 'Plus-2021',
      samplingRate: '2048Hz',
      channels: 128
    },
    {
      id: '04',
      name: 'LiveAmp',
      model: 'LA-2022',
      samplingRate: '500Hz',
      channels: 16
    },
  ]);

  // 使用自定义Hook获取脑波分析数据
  const analysisWaveData = useAnalysisWaveData();

  // 使用自定义Hook获取原始脑电数据
  const rawBrainwaveData = useRawBrainwaveData(500);

  // 处理开始检测/重新分析按钮点击
  const handleActionButtonClick = async () => {
    setLoading(true);
    setError(null);
    try {
      // 更新设备信息
      setDeviceData({
        ...deviceData,
        startTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '-'),
        endTime: new Date(Date.now() + 60000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '-')
      });
    } catch (error) {
      console.error('操作失败:', error);
      setError('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理设备选择
  const handleDeviceSelect = (id: string) => {
    setSelectedDevice(id);
  };

  // 处理确认选择
  const handleConfirmDevice = () => {
    if (selectedDevice) {
      const selectedDeviceData = rawDataTable.find(device => device.id === selectedDevice);
      if (selectedDeviceData) {
        setDeviceData({
          ...deviceData,
          name: selectedDeviceData.name,
          model: selectedDeviceData.model,
          status: `运转率 ${selectedDeviceData.samplingRate}`,
          startTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/\//g, '-'),
          endTime: new Date(Date.now() + 60000).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/\//g, '-')
        });

        // 显示成功消息
        setMessageText(`已选择设备：${selectedDeviceData.name}`);
        setShowMessage(true);

        // 3秒后自动隐藏消息
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 消息提示 */}
      {showMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-500 transform translate-y-0 z-50">
          {messageText}
        </div>
      )}

      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-800">远程脑电数据采集分析系统</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              className={`mr-8 py-4 px-1 ${activeTab === 'rawData'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('rawData')}
            >
              原始数据
            </button>
            <button
              className={`py-4 px-1 ${activeTab === 'analysis'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('analysis')}
            >
              分析报告
            </button>
          </nav>
        </div>

        {/* 设备信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-800">设备名称: {deviceData.name}</h2>
              <div className="mt-2 flex space-x-6 text-sm text-gray-600">
                <span>{deviceData.status}</span>
                <span>开始时间: {deviceData.startTime}</span>
                <span>结束时间: {deviceData.endTime}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              <button
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleActionButtonClick}
                disabled={loading}
              >
                {loading ? '处理中...' : (activeTab === 'rawData' ? '开始检测' : '开始分析')}
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'rawData' ? (
          <div>
            {/* 脑电图和信号质量监控 */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className="text-md font-medium">电极位置图</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {/* 电极位置图  */}
                  <ElectrodeMap />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className="text-md font-medium">信号质量监控</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {/* 信号质量监控图  */}
                  <SignalQualityMap />
                </div>
              </div>
            </div>

            {/* 原始脑电信号图 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="text-md font-medium">原始脑电信号图</h3>
              </div>
              <div className="h-[600px]">
                <BrainwaveChart data={rawBrainwaveData} refreshInterval={500} />
              </div>
            </div>

            {/* 设备列表 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className="text-md font-medium">设备列表</h3>
                </div>
                <button
                  onClick={handleConfirmDevice}
                  disabled={!selectedDevice}
                  className={`px-4 py-2 rounded-md ${selectedDevice
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  确定
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序号</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备名称</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备型号</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">采样频率</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通道数</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rawDataTable.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => handleDeviceSelect(row.id)}
                        className={`cursor-pointer hover:bg-gray-50 ${selectedDevice === row.id ? 'bg-blue-50' : ''
                          }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.samplingRate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.channels}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* 脑波分析图 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="text-md font-medium">脑波分析图</h3>
              </div>
              <WaveChartController
                data={analysisWaveData}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>

            {/* 时频分析 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="text-md font-medium">时频分析</h3>
              </div>
              <div className="h-96">
                <TimeFrequencyChart
                  data={analysisWaveData}
                  currentIndex={currentIndex}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 