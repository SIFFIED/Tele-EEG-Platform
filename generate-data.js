// 生成连续的实时脑电数据，每10ms更新一次
function generateEEGData(count) {
  const data = [];
  // 使用更精确的时间戳格式，包含毫秒
  const baseTime = new Date('2023-10-01T12:00:00.000Z');

  // 生成正弦波数据的函数，确保连续性
  const generateSineWave = (amplitude, frequency, phase, length) => {
    return Array.from({ length }, (_, i) =>
      amplitude * Math.sin(2 * Math.PI * frequency * i / (length * 0.1) + phase)
    );
  };

  // 为每个通道生成不同的波形，使用更高频率以模拟实时数据
  const channel1Wave = generateSineWave(10, 0.5, 0, count);
  const channel2Wave = generateSineWave(8, 0.7, Math.PI / 4, count);
  const channel3Wave = generateSineWave(12, 0.3, Math.PI / 3, count);
  const channel4Wave = generateSineWave(9, 0.6, Math.PI / 2, count);
  const channel5Wave = generateSineWave(11, 0.4, Math.PI / 6, count);
  const channel6Wave = generateSineWave(7, 0.8, Math.PI / 5, count);
  const channel7Wave = generateSineWave(10.5, 0.5, Math.PI / 7, count);
  const channel8Wave = generateSineWave(8.5, 0.6, Math.PI / 8, count);

  // 添加随机噪声，但保持较小的幅度以确保连续性
  const addNoise = (value) => value + (Math.random() * 1 - 0.5);

  // 生成数据点
  for (let i = 0; i < count; i++) {
    // 每10毫秒增加一次
    const timestamp = new Date(baseTime.getTime() + i * 10);

    // 格式化时间戳，包含毫秒
    const formattedTimestamp = timestamp.toISOString().replace('Z', '').replace('T', ' ');

    data.push({
      timestamp: formattedTimestamp,
      channel1: addNoise(channel1Wave[i]),
      channel2: addNoise(channel2Wave[i]),
      channel3: addNoise(channel3Wave[i]),
      channel4: addNoise(channel4Wave[i]),
      channel5: addNoise(channel5Wave[i]),
      channel6: addNoise(channel6Wave[i]),
      channel7: addNoise(channel7Wave[i]),
      channel8: addNoise(channel8Wave[i])
    });
  }

  return data;
}

// 生成1000个数据点（相当于10秒的数据，每10ms一个点）
const jsonData = {
  data: generateEEGData(1000)
};

// 将数据写入文件
const fs = require('fs');
fs.writeFileSync('db.json', JSON.stringify(jsonData, null, 2));
console.log('已生成db.json文件，包含1000个数据点，每10ms一个点'); 