import ast
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Utility.SqliteHelper import SqliteHelper
from typing import List
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# 配置 CORS（允许前端跨域访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化数据库（假设数据库文件在项目根目录）
DB_PATH = "./DB/data.db3"
db = SqliteHelper(DB_PATH)

# 定义数据模型（假设表结构）
class SensorData(BaseModel):
    timestamp: str   # 时间戳（如 "2023-10-01 12:34:56"）
    channel1: float  # 通道1
    channel2: float  # 通道2
    channel3: float  # 通道3
    channel4: float  # 通道4
    channel5: float  # 通道5
    channel6: float  # 通道6
    channel7: float  # 通道7
    channel8: float  # 通道8


def parse_channel_data(data_str: str) -> List[float]:
    """将数据库中的字符串解析为8个通道的浮点数列表"""
    try:
        # 假设数据以逗号分隔，例如 "23.5,45.6,67.8,89.0,12.3,34.5,56.7,78.9"
        channels = list(map(float, data_str.split(',')))
        if len(channels) != 8:
            raise ValueError("数据必须包含8个通道")
        return channels
    except Exception as e:
        raise ValueError(f"数据解析失败: {str(e)}")

@app.get("/data/", response_model=List[SensorData])
def get_all_tasks():
    """获取所有数据"""
    try:
        # 查询数据库
        results = db.query("SELECT timestamp, data FROM DATA ORDER BY id LIMIT 100")
        data_list = []
        for row in results:
            timestamp = row[0]
            channels =  ast.literal_eval(row[1])
            data_list.append({
                "timestamp": timestamp,
                "channel1": channels[0],
                "channel2": channels[1],
                "channel3": channels[2],
                "channel4": channels[3],
                "channel5": channels[4],
                "channel6": channels[5],
                "channel7": channels[6],
                "channel8": channels[7],
            })
        return data_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/data/{timestamp}", response_model=SensorData)
def get_data_by_time(timestamp: str):
    """根据 时间戳查询数据"""
    try:
        # 注意：这里存在 SQL 注入风险（需确保 task_id 安全）
        results = db.query(
            "SELECT timestamp, data FROM DATA WHERE timestamp = " + timestamp
        )
        
        if not results:
            raise HTTPException(status_code=404, detail="未找到数据")
        # print(results)
        timestamp = results[0][0]
        channels =  ast.literal_eval(results[0][1])
        # channels = parse_channel_data(data_str)
        return {
            "timestamp": timestamp,
            "channel1": channels[0],
            "channel2": channels[1],
            "channel3": channels[2],
            "channel4": channels[3],
            "channel5": channels[4],
            "channel6": channels[5],
            "channel7": channels[6],
            "channel8": channels[7],
        }
            
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == '__main__':
    uvicorn.run(app='main:app',host="127.0.0.1",port = 8000,reload = True)