import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Space, Alert } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

interface CheckButtonProps {
  onStartCheck: () => void;
  onStopCheck: () => void;
  loading?: boolean;
  error?: string | null;
  isChecking?: boolean;
  setIsChecking?: (isChecking: boolean) => void;
}

const CheckButton: React.FC<CheckButtonProps> = ({
  onStartCheck,
  onStopCheck,
  loading = false,
  error = null,
  isChecking: externalIsChecking,
  setIsChecking: externalSetIsChecking
}) => {
  const [internalIsChecking, setInternalIsChecking] = useState(false);

  const isChecking = externalIsChecking !== undefined ? externalIsChecking : internalIsChecking;
  const setIsChecking = externalSetIsChecking || setInternalIsChecking;

  const handleClick = () => {
    if (isChecking) {
      setIsChecking(false);
      onStopCheck();
    } else {
      setIsChecking(true);
      onStartCheck();
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
      <Tooltip title={isChecking ? "点击停止检测" : "点击开始检测"}>
        <Button
          type={isChecking ? "primary" : "primary"}
          danger={isChecking}
          onClick={handleClick}
          disabled={loading}
          size="middle"
          icon={loading ? <LoadingOutlined /> : (isChecking ? <PauseCircleOutlined /> : <PlayCircleOutlined />)}
          style={{
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {loading ? '处理中...' : (isChecking ? '停止检测' : '开始检测')}
        </Button>
      </Tooltip>
    </div>
  );
};

export default CheckButton;
