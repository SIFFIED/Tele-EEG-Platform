import React, { useState } from 'react';
import { Button, Tooltip, Alert } from 'antd';
import { LineChartOutlined, StopOutlined, LoadingOutlined } from '@ant-design/icons';

interface AnalysisButtonProps {
  onStartAnalysis: () => void;
  onStopAnalysis: () => void;
  loading?: boolean;
  error?: string | null;
  isAnalyzing?: boolean;
  setIsAnalyzing?: (isAnalyzing: boolean) => void;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({
  onStartAnalysis,
  onStopAnalysis,
  loading = false,
  error = null,
  isAnalyzing: externalIsAnalyzing,
  setIsAnalyzing: externalSetIsAnalyzing
}) => {
  // 如果提供了外部状态，则使用外部状态；否则使用内部状态
  const [internalIsAnalyzing, setInternalIsAnalyzing] = useState(false);

  // 使用外部状态或内部状态
  const isAnalyzing = externalIsAnalyzing !== undefined ? externalIsAnalyzing : internalIsAnalyzing;
  const setIsAnalyzing = externalSetIsAnalyzing || setInternalIsAnalyzing;

  // 处理按钮点击
  const handleClick = () => {
    if (isAnalyzing) {
      // 当前正在分析，点击后停止分析
      setIsAnalyzing(false);
      onStopAnalysis();
    } else {
      // 当前未分析，点击后开始分析
      setIsAnalyzing(true);
      onStartAnalysis();
    }
  };

  return (
    <div className="flex flex-col items-end">
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-3"
          style={{ maxWidth: '300px' }}
        />
      )}
      <Tooltip title={isAnalyzing ? "点击停止分析" : "点击开始分析"}>
        <Button
          type={isAnalyzing ? "primary" : "primary"}
          danger={isAnalyzing}
          onClick={handleClick}
          disabled={loading}
          size="middle"
          icon={loading ? <LoadingOutlined /> : (isAnalyzing ? <StopOutlined /> : <LineChartOutlined />)}
          style={{
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {loading ? '处理中...' : (isAnalyzing ? '停止分析' : '开始分析')}
        </Button>
      </Tooltip>
    </div>
  );
};

export default AnalysisButton;
