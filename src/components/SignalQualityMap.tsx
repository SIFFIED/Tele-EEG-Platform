import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ElectrodePosition {
  id: string;
  x: number;
  y: number;
}

interface SignalQualityMapProps {
  data?: number[];
  refreshInterval?: number;
}

const SignalQualityMap: React.FC<SignalQualityMapProps> = ({
  data = [],
  refreshInterval = 1000
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // 电极位置定义
  const electrodes: ElectrodePosition[] = [
    // Frontal
    { id: 'FP1', x: 0.35, y: 0.12 },
    { id: 'FP2', x: 0.65, y: 0.12 },
    { id: 'F7', x: 0.15, y: 0.25 },
    { id: 'F3', x: 0.35, y: 0.25 },
    { id: 'FZ', x: 0.5, y: 0.25 },
    { id: 'F4', x: 0.65, y: 0.25 },
    { id: 'F8', x: 0.85, y: 0.25 },

    // Temporal & Central
    { id: 'A1', x: 0.001, y: 0.5 }, // 新增A1
    { id: 'T3', x: 0.15, y: 0.5 },
    { id: 'C3', x: 0.35, y: 0.5 },
    { id: 'CZ', x: 0.5, y: 0.5 },
    { id: 'C4', x: 0.65, y: 0.5 },
    { id: 'T4', x: 0.85, y: 0.5 },
    { id: 'A2', x: 1, y: 0.5 }, // 新增A2

    // Parietal & Temporal
    { id: 'T5', x: 0.15, y: 0.75 },
    { id: 'P3', x: 0.35, y: 0.75 },
    { id: 'PZ', x: 0.5, y: 0.75 },
    { id: 'P4', x: 0.65, y: 0.75 },
    { id: 'T6', x: 0.85, y: 0.75 },

    // Occipital
    { id: 'O1', x: 0.35, y: 0.88 },
    { id: 'OZ', x: 0.5, y: 0.90 }, // 新增OZ
    { id: 'O2', x: 0.65, y: 0.88 }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) * 0.45;

    // 清除现有内容
    d3.select(svgRef.current).selectAll('*').remove();

    // 创建SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 创建径向渐变
    const defs = svg.append('defs');

    // 创建径向渐变用于背景
    const backgroundGradient = defs.append('radialGradient')
      .attr('id', 'background-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    backgroundGradient.append('stop')
      .attr('offset', '85%')
      .attr('stop-color', '#fff')
      .attr('stop-opacity', 1);

    backgroundGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#fff')
      .attr('stop-opacity', 0);

    // 创建热力图渐变
    const heatmapGradient = defs.append('linearGradient')
      .attr('id', 'heatmap-gradient')
      .attr('gradientTransform', 'rotate(90)');

    const colors = [
      { offset: 0, color: '#f00', value: 1.5 },     // 红色（高）
      { offset: 0.25, color: '#ff0', value: 0.75 }, // 黄色
      { offset: 0.5, color: '#0f0', value: 0 },     // 绿色
      { offset: 0.75, color: '#0ff', value: -0.75 }, // 青色
      { offset: 1, color: '#00f', value: -1.5 }     // 深蓝（低）
    ];

    colors.forEach(({ offset, color }) => {
      heatmapGradient.append('stop')
        .attr('offset', `${offset * 100}%`)
        .attr('stop-color', color);
    });

    // 创建插值器
    const interpolateColor = d3.scaleLinear<string>()
      .domain([-1.5, -0.75, 0, 0.75, 1.5])
      .range(['#00f', '#0ff', '#0f0', '#ff0', '#f00'])
      .interpolate(d3.interpolateRgb);

    // 绘制头部轮廓
    svg.append('circle')
      .attr('r', radius)
      .attr('fill', 'url(#background-gradient)')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    // 创建电极点的组
    const electrodeGroups = svg.selectAll('g.electrode')
      .data(electrodes)
      .enter()
      .append('g')
      .attr('class', 'electrode')
      .attr('transform', d => {
        const x = (d.x - 0.5) * radius * 1.8;
        const y = (d.y - 0.5) * radius * 1.8;
        return `translate(${x}, ${y})`;
      });

    // 绘制电极点
    electrodeGroups.append('circle')
      .attr('r', radius * 0.04)
      .attr('fill', 'white')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    // 绘制电极标签
    electrodeGroups.append('text')
      .attr('dy', -radius * 0.06)
      .attr('text-anchor', 'middle')
      .attr('font-size', radius * 0.06)
      .attr('fill', '#333')
      .text(d => d.id);

    // 更新电极点颜色
    const updateColors = () => {
      electrodeGroups.select('circle')
        .attr('fill', (d, i) => interpolateColor(data[i] || 0));
    };

    // 初始更新颜色
    updateColors();

    // 添加颜色图例
    const legendWidth = 20;  // 调整为垂直图例的宽度
    const legendHeight = radius * 0.8;  // 调整图例高度

    const legendScale = d3.scaleLinear()
      .domain([-1.5, 1.5])
      .range([legendHeight, 0]);  // 反转范围使负值在底部

    const legendAxis = d3.axisRight(legendScale)
      .ticks(7)
      .tickSize(6);  // 调整刻度线长度

    const legend = svg.append('g')
      .attr('transform', `translate(${radius * 1.3}, ${-legendHeight / 2})`);

    // 创建渐变色带
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#heatmap-gradient)');

    // 添加刻度
    const legendAxisGroup = legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis);

    // 优化刻度样式
    legendAxisGroup.select('.domain').attr('stroke', '#666');
    legendAxisGroup.selectAll('.tick line').attr('stroke', '#666');
    legendAxisGroup.selectAll('.tick text')
      .attr('x', 8)
      .attr('dy', '0.32em')
      .style('font-size', '12px')
      .style('fill', '#666');

    // 添加"高"和"低"的标签
    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .style('font-size', '12px')
      .text('高');

    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', legendHeight + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .style('font-size', '12px')
      .text('低');

  }, [data]);

  // 模拟数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      // 这里可以添加实时数据更新逻辑
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      />
    </div>
  );
};

export default SignalQualityMap; 