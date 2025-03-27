import React from 'react';
import electrodeMapImage from '../assets/images/001.png';

// 电极位置图组件
export const ElectrodeMap: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={electrodeMapImage}
        alt="电极位置图"
        className="max-w-full max-h-full object-contain"
        style={{ filter: 'brightness(0.95)' }} // 轻微调整亮度以匹配UI风格
      />
    </div>
  );
};

// 信号质量热力图组件
export const SignalQualityMap: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* 头部轮廓 */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="#ccc" strokeWidth="2" />

        {/* 电极点 - 使用不同颜色表示信号质量 */}
        <circle cx="100" cy="40" r="8" fill="#4CAF50" /> {/* 优 */}
        <circle cx="60" cy="60" r="8" fill="#4CAF50" />
        <circle cx="140" cy="60" r="8" fill="#FFC107" /> {/* 中 */}
        <circle cx="40" cy="100" r="8" fill="#FFC107" />
        <circle cx="160" cy="100" r="8" fill="#F44336" /> {/* 差 */}
        <circle cx="60" cy="140" r="8" fill="#F44336" />
        <circle cx="140" cy="140" r="8" fill="#4CAF50" />

        {/* 中心点 */}
        <circle cx="100" cy="100" r="8" fill="#2196F3" />

        {/* 连接线 */}
        <line x1="100" y1="40" x2="100" y2="160" stroke="#eee" strokeWidth="1" />
        <line x1="40" y1="100" x2="160" y2="100" stroke="#eee" strokeWidth="1" />
      </svg>
    </div>
  );
}; 