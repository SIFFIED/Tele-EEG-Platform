# 🧠 Tele-EEG-Platform: 远程脑电数据采集分析平台

[![许可证](https://img.shields.io/badge/许可证-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![基于 React 构建](https://img.shields.io/badge/基于-React-61DAFB.svg)](https://reactjs.org/)
[![WebAssembly 就绪](https://img.shields.io/badge/WebAssembly-就绪-007bff.svg)](https://webassembly.org/)

Tele-EEG-Platform 是一款前沿的 Web 平台，专为实时采集、高级分析和直观展示脑电图 (EEG) 数据而设计。Tele-EEG-Platform 致力于为研究人员、临床医生和神经科学家提供强大的工具，帮助他们以前所未有的性能和精度深入了解大脑活动。

## 🚀 核心特性

*   **实时数据采集：** 无缝连接到 EEG 设备，并通过 WebSockets 实时采集多通道脑电数据。
*   **WebAssembly 加速的高性能处理：** 利用基于优化的 Rust 代码编译的 WebAssembly (WASM) 的强大能力，实现超快的信号处理、滤波和特征提取。
*   **GPU 加速的可视化：** 使用 WebGL 和自定义 GLSL 着色器，以令人惊叹的性能展示大规模 EEG 数据集，实现 2D 和 3D 呈现。
*   **高级时频分析：** 通过高效的流式算法，探索脑电波的动态变化，生成实时的频谱图和时频图。
*   **交互式数据探索：** 缩放、平移和选择数据区域，进行详细分析。支持导出多种格式的数据，用于离线处理。
*   **模块化和可扩展的架构：** 轻松添加新的信号处理算法、可视化技术和设备集成。
*   **用户友好的界面：** 采用 React 和 Ant Design 构建的直观、响应式界面，确保流畅的用户体验。

## ✨ 技术栈

*   **前端：** React, TypeScript, Redux, Ant Design
*   **可视化：** WebGL, GLSL, ECharts
*   **实时通信：** WebSockets
*   **高性能计算：** WebAssembly (Rust)
*   **构建工具：** Webpack

## ⚙️ 架构

简化的架构概览：

1.  **数据采集：** EEG 数据通过 WebSockets 从 EEG 设备流向前端。
2.  **数据处理：** 基于优化的 Rust 代码编译的 WebAssembly 模块执行实时的信号处理和特征提取。
3.  **可视化：** 使用 WebGL 和 ECharts 渲染交互式、高性能的脑电波数据可视化。
4.  **用户界面：** React 和 Ant Design 提供用户友好的界面，用于数据探索和分析。

## 🔬 关键技术

该项目采用了多项先进技术，以实现高性能和可扩展性：

*   **WebAssembly 加速：**
    *   将计算密集型的信号处理任务转移到 WebAssembly 模块，实现接近原生性能。
    *   在 WebAssembly 模块中使用 SIMD 指令进行并行数据处理。
*   **GPU 加速的渲染：**
    *   使用 WebGL 和自定义 GLSL 着色器以高帧率渲染大规模数据集。
    *   使用实例化渲染技术，绘制成千上万的波形，将开销降到最低。
*   **流式算法：**
    *   使用高效的流式算法进行实时的时频分析。
    *   采用滑动窗口技术，处理小块数据，最大限度地减少延迟。

## 📦 安装

1.  克隆仓库：

    ```bash
    git clone https://github.com/SIFFIED/Tele-EEG-Platform.git
    cd Tele-EEG-Platform
    ```

2.  安装依赖：

    ```bash
    npm install
    ```

3.  配置你的 EEG 设备连接（请参阅 [设备集成指南](#设备集成) 获取详细信息）。

4.  启动开发服务器：

    ```bash
    npm start
    ```

## 📝 使用说明

1.  在您的 Web 浏览器中打开应用程序。
2.  从设备列表中选择一个 EEG 设备。
3.  点击“开始采集”按钮开始数据流。
4.  探索实时的波形图和时频分析。
5.  使用交互式控件进行缩放、平移和选择数据区域。

## 🤝 贡献

我们欢迎社区贡献！ 欢迎您的参与：

1.  Fork 此仓库。
2.  为您的功能或错误修复创建一个新分支。
3.  实现您的更改。
4.  提交拉取请求。

请遵循 [贡献指南](CONTRIBUTING.md) 以获取更多详细信息。

## 📜 许可证

本项目遵循 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

### 步骤

1.  将您的 EEG 设备连接到您的计算机。
2.  确保您的设备被操作系统识别。

## 🤝 鸣谢

*   姚远（YAO YUAN） - 项目负责人

## ✉️ 联系方式

如有疑问和反馈，请联系 y634417630@163.com。