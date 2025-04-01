import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  ElectrodeMap,
} from './components/DummyImages';
import SignalQualityMap from './components/SignalQualityMap';
import BrainwaveChart from './components/BrainwaveChart';
import WaveChartController from './components/WaveChartController';
import TimeFrequencyChart from './components/TimeFrequencyChart';
import { useAnalysisWaveData } from './services/analysisWaveData';
import { useRawBrainwaveData } from './services/rawWaveData';
import CheckButton from './components/CheckButton';
import AnalysisButton from './components/AnalysisButton';
import {
  Layout,
  Typography,
  Tabs,
  Card,
  Table,
  Tag,
  Row,
  Col,
  Divider,
  Space,
  message,
  Badge,
  Button
} from 'antd';
import {
  DashboardOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  AimOutlined,
  BulbOutlined,
  BarChartOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);
  // 添加分析数据连接状态
  const [isAnalysisConnected, setIsAnalysisConnected] = useState(false);

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
  const analysisWaveData = useAnalysisWaveData(isAnalysisConnected);

  // 使用自定义Hook获取原始脑电数据，但只在连接后端时获取数据
  const rawBrainwaveData = useRawBrainwaveData(isConnectedToBackend ? 500 : undefined);

  // 处理开始检测按钮点击
  const handleStartCheck = async () => {
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

      // 设置连接状态为已连接
      setIsConnectedToBackend(true);

      // 显示成功消息
      setMessageText('已开始检测，正在获取数据...');
      setShowMessage(true);
      message.success('已开始检测，正在获取数据...');
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

    } catch (error) {
      console.error('操作失败:', error);
      setError('操作失败，请稍后重试');
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理停止检测按钮点击
  const handleStopCheck = () => {
    setIsConnectedToBackend(false);

    // 显示成功消息
    setMessageText('已停止检测，与后端断开连接');
    setShowMessage(true);
    message.info('已停止检测，与后端断开连接');
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  // 处理开始分析按钮点击
  const handleStartAnalysis = async () => {
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

      // 设置连接状态为已连接
      setIsAnalysisConnected(true);

      // 显示成功消息
      setMessageText('已开始分析，正在获取数据...');
      setShowMessage(true);
      message.success('已开始分析，正在获取数据...');
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

    } catch (error) {
      console.error('操作失败:', error);
      setError('操作失败，请稍后重试');
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理停止分析按钮点击
  const handleStopAnalysis = () => {
    setIsAnalysisConnected(false);

    // 显示成功消息
    setMessageText('已停止分析，与后端断开连接');
    setShowMessage(true);
    message.info('已停止分析，与后端断开连接');
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
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
        message.success(`已选择设备：${selectedDeviceData.name}`);

        // 3秒后自动隐藏消息
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      key: 'model',
      width: '20%',
    },
    {
      title: '采样频率',
      dataIndex: 'samplingRate',
      key: 'samplingRate',
      width: '20%',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '通道数',
      dataIndex: 'channels',
      key: 'channels',
      width: '15%',
      render: (text: number) => <Tag color="green">{text}</Tag>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm flex items-center">
        <div className="container mx-auto px-4 flex items-center">
          <Title level={4} style={{ margin: 0 }}>
            <DashboardOutlined style={{ marginRight: 8 }} />
            远程脑电数据采集分析系统
          </Title>
        </div>
      </Header>

      <Content className="p-6 bg-gray-50">
        <div className="container mx-auto">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            className="mb-6"
          >
            <TabPane
              tab={<span><DatabaseOutlined />原始数据</span>}
              key="rawData"
            />
            <TabPane
              tab={<span><BarChartOutlined />分析报告</span>}
              key="analysis"
            />
          </Tabs>

          {/* 设备信息 */}
          <Card
            className="mb-6 shadow-sm"
            title={
              <Space>
                <AppstoreOutlined />
                <span>设备信息</span>
              </Space>
            }
            extra={
              activeTab === 'rawData' ? (
                <CheckButton
                  onStartCheck={handleStartCheck}
                  onStopCheck={handleStopCheck}
                  loading={loading}
                  error={error}
                  isChecking={isConnectedToBackend}
                  setIsChecking={setIsConnectedToBackend}
                />
              ) : (
                <AnalysisButton
                  onStartAnalysis={handleStartAnalysis}
                  onStopAnalysis={handleStopAnalysis}
                  loading={loading}
                  error={error}
                  isAnalyzing={isAnalysisConnected}
                  setIsAnalyzing={setIsAnalysisConnected}
                />
              )
            }
          >
            <Row gutter={24}>
              <Col span={8}>
                <Text strong>设备名称:</Text> {deviceData.name}
              </Col>
              <Col span={8}>
                <Text strong>运行状态:</Text>
                <Badge
                  status={deviceData.status.includes('未知') ? 'default' : 'processing'}
                  text={deviceData.status}
                  style={{ marginLeft: 8 }}
                />
              </Col>
              <Col span={8}>
                <Space>
                  <ClockCircleOutlined />
                  <Text strong>时间范围:</Text>
                  <Text type="secondary">{deviceData.startTime} ~ {deviceData.endTime}</Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 内容区域 */}
          {activeTab === 'rawData' ? (
            <>
              {/* 脑电图和信号质量监控 */}
              <Row gutter={16} className="mb-6">
                <Col span={12}>
                  <Card
                    className="shadow-sm h-full"
                    title={
                      <Space>
                        <AimOutlined style={{ color: '#1890ff' }} />
                        <span>国际10-20系统电极位置图</span>
                      </Space>
                    }
                  >
                    <div className="h-72 flex items-center justify-center">
                      <ElectrodeMap />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      显示各脑区电极的标准位置，包括额叶、颞叶、中央、顶叶和枕叶区域
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    className="shadow-sm h-full"
                    title={
                      <Space>
                        <BulbOutlined style={{ color: '#1890ff' }} />
                        <span>信号质量监控</span>
                      </Space>
                    }
                  >
                    <div className="h-72 flex items-center justify-center">
                      <SignalQualityMap />
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* 原始脑电信号图 */}
              <Card
                className="mb-6 shadow-sm"
                title={
                  <Space>
                    <LineChartOutlined style={{ color: '#1890ff' }} />
                    <span>原始脑电信号图</span>
                  </Space>
                }
              >
                <div className="h-[600px]">
                  <BrainwaveChart data={rawBrainwaveData} refreshInterval={500} />
                </div>
              </Card>

              {/* 设备列表 */}
              <Card
                className="shadow-sm"
                title={
                  <Space>
                    <AppstoreOutlined style={{ color: '#1890ff' }} />
                    <span>设备列表</span>
                  </Space>
                }
                extra={
                  <Button
                    type="primary"
                    disabled={!selectedDevice}
                    onClick={handleConfirmDevice}
                  >
                    确定
                  </Button>
                }
              >
                <Table
                  dataSource={rawDataTable}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  rowClassName={(record) => (record.id === selectedDevice ? 'ant-table-row-selected' : '')}
                  onRow={(record) => ({
                    onClick: () => handleDeviceSelect(record.id),
                    style: { cursor: 'pointer' }
                  })}
                />
              </Card>
            </>
          ) : (
            <>
              {/* 脑波分析图 */}
              <Card
                className="mb-6 shadow-sm"
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#1890ff' }} />
                    <span>脑波分析图</span>
                  </Space>
                }
              >
                <WaveChartController
                  data={analysisWaveData}
                />
              </Card>

              {/* 时频分析 */}
              <Card
                className="mb-6 shadow-sm"
                title={
                  <Space>
                    <LineChartOutlined style={{ color: '#1890ff' }} />
                    <span>时频分析</span>
                  </Space>
                }
              >
                <div className="h-96">
                  <TimeFrequencyChart
                    data={analysisWaveData}
                  />
                </div>
              </Card>
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App; 