const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 确保images目录存在
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 生成电极位置图
function generateElectrodeMap() {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  // 绘制圆形背景
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.fill();

  // 绘制电极位置
  const electrodes = [
    { x: 200, y: 50, label: 'Fp1' },
    { x: 250, y: 50, label: 'Fp2' },
    { x: 150, y: 100, label: 'F7' },
    { x: 200, y: 100, label: 'Fz' },
    { x: 250, y: 100, label: 'F8' },
    { x: 100, y: 150, label: 'T3' },
    { x: 150, y: 150, label: 'C3' },
    { x: 200, y: 150, label: 'Cz' },
    { x: 250, y: 150, label: 'C4' },
    { x: 300, y: 150, label: 'T4' },
    { x: 150, y: 200, label: 'P3' },
    { x: 200, y: 200, label: 'Pz' },
    { x: 250, y: 200, label: 'P4' },
    { x: 100, y: 250, label: 'T5' },
    { x: 200, y: 250, label: 'Oz' },
    { x: 300, y: 250, label: 'T6' }
  ];

  // 绘制电极点和标签
  electrodes.forEach(electrode => {
    // 绘制电极点
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(electrode.x, electrode.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制标签
    ctx.fillStyle = '#1e293b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(electrode.label, electrode.x, electrode.y);
  });

  // 保存图像
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'electrode-map.png'), buffer);
  console.log('电极位置图已生成');
}

// 生成信号质量热力图
function generateSignalQualityMap() {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  // 绘制圆形背景
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.fill();

  // 创建径向渐变
  const gradient = ctx.createRadialGradient(200, 180, 50, 200, 180, 180);
  gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // 红色中心
  gradient.addColorStop(0.5, 'rgba(250, 204, 21, 0.6)'); // 黄色中间
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0.4)'); // 绿色边缘

  // 应用渐变
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.fill();

  // 绘制电极位置
  const electrodes = [
    { x: 200, y: 50, label: 'Fp1' },
    { x: 250, y: 50, label: 'Fp2' },
    { x: 150, y: 100, label: 'F7' },
    { x: 200, y: 100, label: 'Fz' },
    { x: 250, y: 100, label: 'F8' },
    { x: 100, y: 150, label: 'T3' },
    { x: 150, y: 150, label: 'C3' },
    { x: 200, y: 150, label: 'Cz' },
    { x: 250, y: 150, label: 'C4' },
    { x: 300, y: 150, label: 'T4' },
    { x: 150, y: 200, label: 'P3' },
    { x: 200, y: 200, label: 'Pz' },
    { x: 250, y: 200, label: 'P4' },
    { x: 100, y: 250, label: 'T5' },
    { x: 200, y: 250, label: 'Oz' },
    { x: 300, y: 250, label: 'T6' }
  ];

  // 绘制电极点和标签
  electrodes.forEach(electrode => {
    // 绘制电极点
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(electrode.x, electrode.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制标签
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(electrode.label, electrode.x, electrode.y);
  });

  // 添加颜色图例
  ctx.fillStyle = 'white';
  ctx.fillRect(320, 50, 20, 100);

  const legendGradient = ctx.createLinearGradient(320, 50, 320, 150);
  legendGradient.addColorStop(0, 'rgba(239, 68, 68, 1)'); // 红色顶部
  legendGradient.addColorStop(0.5, 'rgba(250, 204, 21, 1)'); // 黄色中间
  legendGradient.addColorStop(1, 'rgba(34, 197, 94, 1)'); // 绿色底部

  ctx.fillStyle = legendGradient;
  ctx.fillRect(320, 50, 20, 100);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.strokeRect(320, 50, 20, 100);

  // 添加图例标签
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('1.5', 345, 50);
  ctx.fillText('0.0', 345, 100);
  ctx.fillText('-1.5', 345, 150);

  // 保存图像
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'signal-quality-map.png'), buffer);
  console.log('信号质量热力图已生成');
}

// 生成功率谱图
function generatePowerSpectrum(name, color) {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 400, 200);

  // 绘制坐标轴
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(350, 150);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(50, 50);
  ctx.stroke();

  // 生成随机数据点
  const dataPoints = [];
  for (let i = 0; i < 300; i += 10) {
    const x = 50 + i;
    const height = Math.random() * 60 + 20;
    dataPoints.push({ x, y: 150 - height });
  }

  // 绘制曲线
  ctx.beginPath();
  ctx.moveTo(dataPoints[0].x, 150);
  dataPoints.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      const prevPoint = dataPoints[index - 1];
      const cpx = (prevPoint.x + point.x) / 2;
      const cpy1 = prevPoint.y;
      const cpy2 = point.y;
      ctx.bezierCurveTo(cpx, cpy1, cpx, cpy2, point.x, point.y);
    }
  });
  ctx.lineTo(dataPoints[dataPoints.length - 1].x, 150);
  ctx.closePath();

  // 填充曲线下方区域
  ctx.fillStyle = color;
  ctx.fill();

  // 添加标题
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${name}波功率谱`, 200, 30);

  // 添加坐标轴标签
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('频率 (Hz)', 200, 180);
  ctx.save();
  ctx.translate(20, 100);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('功率 (μV²/Hz)', 0, 0);
  ctx.restore();

  // 添加刻度
  for (let i = 0; i <= 250; i += 50) {
    const x = 50 + i;
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x, 155);
    ctx.stroke();
    ctx.fillText(i, x, 170);
  }

  // 保存图像
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, `${name.toLowerCase()}-power-spectrum.png`), buffer);
  console.log(`${name}波功率谱已生成`);
}

// 生成时频热力图
function generateTimeFrequencyHeatmap() {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 400, 200);

  // 创建热力图数据
  const heatmapData = [];
  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < 150; x++) {
      const value = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.random();
      heatmapData.push({ x, y, value });
    }
  }

  // 绘制热力图
  heatmapData.forEach(point => {
    const x = point.x * 2 + 50;
    const y = point.y * 1.5 + 20;
    const value = point.value;

    // 根据值设置颜色
    let color;
    if (value > 0.8) {
      color = 'rgba(239, 68, 68, 0.8)'; // 红色
    } else if (value > 0.6) {
      color = 'rgba(249, 115, 22, 0.8)'; // 橙色
    } else if (value > 0.4) {
      color = 'rgba(250, 204, 21, 0.8)'; // 黄色
    } else if (value > 0.2) {
      color = 'rgba(132, 204, 22, 0.8)'; // 黄绿色
    } else if (value > 0) {
      color = 'rgba(34, 197, 94, 0.8)'; // 绿色
    } else if (value > -0.2) {
      color = 'rgba(6, 182, 212, 0.8)'; // 青色
    } else if (value > -0.4) {
      color = 'rgba(59, 130, 246, 0.8)'; // 蓝色
    } else if (value > -0.6) {
      color = 'rgba(99, 102, 241, 0.8)'; // 靛蓝色
    } else {
      color = 'rgba(139, 92, 246, 0.8)'; // 紫色
    }

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 2, 1.5);
  });

  // 添加标题
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('时频分析热力图', 200, 15);

  // 添加坐标轴
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 20);
  ctx.lineTo(50, 140);
  ctx.lineTo(350, 140);
  ctx.stroke();

  // 添加坐标轴标签
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('时间 (s)', 200, 160);
  ctx.save();
  ctx.translate(25, 80);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('频率 (Hz)', 0, 0);
  ctx.restore();

  // 添加颜色图例
  ctx.fillStyle = 'white';
  ctx.fillRect(370, 20, 20, 120);

  const legendGradient = ctx.createLinearGradient(370, 20, 370, 140);
  legendGradient.addColorStop(0, 'rgba(239, 68, 68, 1)'); // 红色顶部
  legendGradient.addColorStop(0.125, 'rgba(249, 115, 22, 1)'); // 橙色
  legendGradient.addColorStop(0.25, 'rgba(250, 204, 21, 1)'); // 黄色
  legendGradient.addColorStop(0.375, 'rgba(132, 204, 22, 1)'); // 黄绿色
  legendGradient.addColorStop(0.5, 'rgba(34, 197, 94, 1)'); // 绿色
  legendGradient.addColorStop(0.625, 'rgba(6, 182, 212, 1)'); // 青色
  legendGradient.addColorStop(0.75, 'rgba(59, 130, 246, 1)'); // 蓝色
  legendGradient.addColorStop(0.875, 'rgba(99, 102, 241, 1)'); // 靛蓝色
  legendGradient.addColorStop(1, 'rgba(139, 92, 246, 1)'); // 紫色底部

  ctx.fillStyle = legendGradient;
  ctx.fillRect(370, 20, 20, 120);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.strokeRect(370, 20, 20, 120);

  // 添加图例标签
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('1.5', 395, 20);
  ctx.fillText('0.0', 395, 80);
  ctx.fillText('-1.5', 395, 140);

  // 保存图像
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'time-frequency-heatmap.png'), buffer);
  console.log('时频热力图已生成');
}

// 生成刺激标记波形图
function generateStimulusMarker() {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 400, 200);

  // 绘制坐标轴
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(350, 150);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(50, 50);
  ctx.stroke();

  // 生成随机数据点
  const dataPoints = [];
  for (let i = 0; i < 300; i += 5) {
    const x = 50 + i;
    let height;

    // 创建尖峰
    if (i % 50 === 0) {
      height = Math.random() * 20 + 60;
    } else {
      height = Math.random() * 20 + 20;
    }

    dataPoints.push({ x, y: 150 - height });
  }

  // 绘制波形线
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  dataPoints.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  // 添加标题
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('刺激标记', 200, 30);

  // 添加坐标轴标签
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('时间 (s)', 200, 180);
  ctx.save();
  ctx.translate(20, 100);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('振幅', 0, 0);
  ctx.restore();

  // 添加刻度
  for (let i = 0; i <= 14; i += 2) {
    const x = 50 + i * 20;
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x, 155);
    ctx.stroke();
    ctx.fillText(`${i}s`, x, 170);
  }

  // 保存图像
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, 'stimulus-marker.png'), buffer);
  console.log('刺激标记波形图已生成');
}

// 生成3D脑地形图
function generate3DBrainTopography() {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  // 绘制圆形背景
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.fill();

  // 创建径向渐变
  const gradient = ctx.createRadialGradient(200, 180, 50, 200, 180, 180);
  gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // 红色中心
  gradient.addColorStop(0.5, 'rgba(250, 204, 21, 0.6)'); // 黄色中间
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0.4)'); // 绿色边缘

  // 应用渐变
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.fill();

  // 绘制电极位置
  const electrodes = [
    { x: 200, y: 50, label: 'Fp1' },
    { x: 250, y: 50, label: 'Fp2' },
    { x: 150, y: 100, label: 'F7' },
    { x: 200, y: 100, label: 'Fz' },
    { x: 250, y: 100, label: 'F8' },
    { x: 100, y: 150, label: 'T3' },
    { x: 150, y: 150, label: 'C3' },
    { x: 200, y: 150, label: 'Cz' },
    { x: 250, y: 150, label: 'C4' },
    { x: 300, y: 150, label: 'T4' },
    { x: 150, y: 200, label: 'P3' },
    { x: 200, y: 200, label: 'Pz' },
    { x: 250, y: 200, label: 'P4' },
    { x: 100, y: 250, label: 'T5' },
    { x: 200, y: 250, label: 'Oz' },
    { x: 300, y: 250, label: 'T6' }
  ];

  // 绘制电极点和标签
  electrodes.forEach(electrode => {
    // 绘制电极点
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(electrode.x, electrode.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制标签
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(electrode.label, electrode.x, electrode.y);
  });

  // 添加颜色图例
  ctx.fillStyle = 'white';
  ctx.fillRect(320, 50, 20, 100);

  const legendGradient = ctx.createLinearGradient(320, 50, 320, 150);
  legendGradient.addColorStop(0, 'rgba(239, 68, 68, 1)'); // 红色顶部
  legendGradient.addColorStop(0.5, 'rgba(250, 204, 21, 1)'); // 黄色中间
  legendGradient.addColorStop(1, 'rgba(34, 197, 94, 1)'); // 绿色底部

  ctx.fillStyle = legendGradient;
  ctx.fillRect(320, 50, 20, 100);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.strokeRect(320, 50, 20, 100);

  // 添加图例标签
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('1.5', 345, 50);
  ctx.fillText('0.0', 345, 100);
  ctx.fillText('-1.5', 345, 150);

  // 保存图像
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, '3d-brain-topography.png'), buffer);
  console.log('3D脑地形图已生成');
}

// 生成所有图像
generateElectrodeMap();
generateSignalQualityMap();
generatePowerSpectrum('Alpha', 'rgba(59, 130, 246, 0.5)');
generatePowerSpectrum('Beta', 'rgba(239, 68, 68, 0.5)');
generatePowerSpectrum('Delta', 'rgba(16, 185, 129, 0.5)');
generatePowerSpectrum('Gamma', 'rgba(245, 158, 11, 0.5)');
generateTimeFrequencyHeatmap();
generateStimulusMarker();
generate3DBrainTopography();

console.log('所有图像已生成完成！'); 