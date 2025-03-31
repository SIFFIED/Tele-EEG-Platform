import React, { useState, useEffect } from 'react';
import electrodeMapImage from '../assets/images/001.png';

// 提前在模块作用域预加载图片
const preloadedImage = new Image();
preloadedImage.src = electrodeMapImage;

// 电极位置图组件
export const ElectrodeMap: React.FC = () => {
  // 添加加载状态管理
  const [imageLoaded, setImageLoaded] = useState(preloadedImage.complete);

  // 使用effect处理图片加载
  useEffect(() => {
    // 如果图片已经加载完成则直接设置状态
    if (preloadedImage.complete) {
      setImageLoaded(true);
      return;
    }

    // 否则等待加载完成
    const handleLoad = () => setImageLoaded(true);
    preloadedImage.addEventListener('load', handleLoad);

    return () => {
      preloadedImage.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={electrodeMapImage}
        alt="电极位置图"
        className={`max-w-full max-h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          filter: 'brightness(1.05) contrast(1.05)',
          width: '90%',
          height: 'auto',
          transition: 'opacity 0.3s ease-in-out'
        }}
        loading="eager"
        decoding="async"
        onLoad={() => setImageLoaded(true)}

      />
    </div>
  );
};

