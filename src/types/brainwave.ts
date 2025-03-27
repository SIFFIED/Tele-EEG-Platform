// 通道数据接口
export interface ChannelData {
  FP1: number[];
  FP2: number[];
  F3: number[];
  F4: number[];
  C3: number[];
  C4: number[];
  O1: number[];
  O2: number[];
}

// 波段数据接口
export interface WaveData {
  alpha: number[];
  beta: number[];
  delta: number[];
  theta: number[];
} 