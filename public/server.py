from Network.TcpServer import TcpServer, MyRequestHandler
from Network.NetPackage import NetPackage
from Utility.SqliteHelper import SqliteHelper
import threading
import time,json

picDB = SqliteHelper('DB/data.db3')
def up_data(data):
    length = picDB.get_len("DATA")
    # data = [{'timestamp': '2', 'thoroughfare': [1, 2, 3, 4, 5, 6, 7, 8]}, {'timestamp': '3', 'thoroughfare': [1, 2, 3, 4, 5, 6, 7, 8]}, {'timestamp': '4', 'thoroughfare': [1, 2, 3, 4, 5, 6, 7, 8]}]
    insert_sql = "insert into DATA values (?,?,?,?,?)" 
    val = []
    for i in range(length, length+len(data)):
        val.append((i, "",data[i-length]['timestamp'], str(data[i-length]['thoroughfare']), 0))
    picDB.insert_many(insert_sql, val)
    print("插入成功")

def start_tcp_server():
    """ 
    启动tcp服务器通信线程
    """
    th = threading.Thread(target=lambda : server.serve_forever())
    th.setDaemon(True)
    th.start()

# 数据接收外部回调函数
def sever_recv_callback(data:str, addr):
    print("收到数据: ", data)
    print("存入数据库中……")
    np = NetPackage("")
    np.from_json(data)
    json_data = np.data #默认接受str
    # 在这里添加你的数据库存储代码

    try:
        if type(json_data) == str:
            pass
        else:
            parse_data = str(json_data)

        parse_data = json.loads(json_data)
        

        up_data(parse_data)


    except Exception as e:
            np.remark = f"发生错误: {e}"
    # 发送数据回客户端

    np.remark = "成功"
    str_back = np.to_json()
    server.users[addr].sendall(str_back.encode('utf8'))
    print("已发送结果")

TcpServer.allow_reuse_address = True
server = TcpServer(('127.0.0.1', 12345), MyRequestHandler)
server.set_recv_callback(sever_recv_callback)
start_tcp_server()

#主程序继续做其他工作
i = 0
while True:
    i = i+1
    print(f'server------------{i}------------')
    time.sleep(2)


