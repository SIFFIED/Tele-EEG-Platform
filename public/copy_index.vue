<template>
    <div>
      <!-- 基本信息&磁盘信息 -->
      <el-container class="top">
        <!-- 基本信息 -->
        <el-aside width="calc(40%)" class="tl">
          <el-row>
            <el-col :span="24"><div class="ht">基本信息</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">服务器名称：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ serverinfo.name }}</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">公网ip：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ serverinfo.ip }}</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">操作系统：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ serverinfo.os }}</div></el-col
            >
          </el-row>
        </el-aside>
        <!-- 磁盘信息 -->
        <div class="tr">
          <el-row>
            <el-col :span="24"><div class="ht">磁盘信息</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="left-ul">盘符路径：</div></el-col>
            <el-col :span="20"
              ><div class="right-ul">{{ servermem.driveurl }}</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="4"><div class="left-ul">总大小：</div></el-col>
            <el-col :span="20"
              ><div class="right-ul">{{ servermem.total }}GB</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="4"><div class="left-ul">可用大小：</div></el-col>
            <el-col :span="20"
              ><div class="right-ul">{{ servermem.free }}GB</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="4"><div class="left-ul">已用百分比：</div></el-col>
            <el-col :span="20"
              ><div class="right-ul">
                {{ Math.floor(servermem.usedRate * 100) / 100 }}%
              </div></el-col
            >
          </el-row>
        </div>
      </el-container>
      <!-- CPU信息 -->
      <el-container class="center">
        <el-aside width="calc(40%)">
          <el-row>
            <el-col :span="24"><div class="ht">CPU信息</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">核心数：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ servercpu.core }}</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">用户使用率：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">
                {{ Math.floor(servercpu.user * 100) / 100 }}%
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">系统使用率：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">
                {{ Math.floor(servercpu.system * 100) / 100 }}%
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">当前空闲率：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">
                {{ Math.floor(servercpu.idle * 100) / 100 }}%
              </div></el-col
            >
          </el-row>
        </el-aside>
        <!-- cpu折线图 -->
        <div id="cpu" class="linechart"></div>
      </el-container>
      <!-- <el-button @click="add"></el-button> -->
      <!-- 内存信息 -->
      <el-container class="center">
        <el-aside width="calc(40%)">
          <el-row>
            <el-col :span="24"><div class="ht">内存信息</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">总内存：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ serverram.total }}GB</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">已用内存：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ serverram.used }}GB</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">剩余内存：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">{{ serverram.free }}GB</div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"><div class="left-ul">当前空闲率：</div></el-col>
            <el-col :span="18"
              ><div class="right-ul">
                {{ Math.floor(serverram.idle * 100) / 100 }}%
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="24"><div></div></el-col>
          </el-row>
        </el-aside>
        <!-- 内存空闲率折线图 -->
        <div id="idle" class="linechart"></div>
      </el-container>
    </div>
  </template>
  
  <script>
  import * as server from "@/api/server";
  import * as echarts from "echarts";
  
  export default {
    name: "Server",
    data() {
      return {
        /**基本信息 */
        serverinfo: [],
        /**磁盘信息 */
        servermem: [],
        /**cpu信息 */
        servercpu: [],
        /**内存信息 */
        serverram: [],
        /**cpu使用率 */
        myChartcpu: undefined,
        /**cpu折线图设置 */
        cpuOption: {
          title: {
            text: "CPU使用率"
          },
          /**图例 */
          legend: {
            data: ["系统使用率", "用户使用率"]
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          /**tooltip配置项示例 */
          tooltip: {
            trigger: "axis",
            //用formatter回调函数显示单项数据内容
            formatter: function() {},
            axisPointer: {
              animation: true
            }
          },
          xAxis: {
            type: "category",
            data: [],
            minInterval: 1
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value} %"
            }
          },
          series: [
            {
              data: [],
              type: "line",
              smooth: false,
              symbol: "none",
              name: "系统使用率"
            },
            {
              data: [],
              type: "line",
              smooth: false,
              symbol: "none",
              name: "用户使用率"
            }
          ]
        },
        systemRate: [],
        userRate: [],
        /**内存空闲率 */
        myChartidle: undefined,
        /**内存空闲率折线图设置 */
        idleOption: {
          title: {
            text: "内存空闲率"
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          /**tooltip配置项示例 */
          tooltip: {
            trigger: "axis",
            //用formatter回调函数显示单项数据内容
            formatter: function() {},
            axisPointer: {
              animation: true
            }
          },
          xAxis: {
            type: "category",
            data: [],
            minInterval: 1
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value} %"
            }
          },
          series: [
            {
              data: [], //绑定实时数据数组
              type: "line",
              smooth: false,
              symbol: "none",
              name: "内存空闲率"
            }
          ]
        },
        idleRate: [],
        /**定时器 */
        timer: undefined,
        time: [],
        time2: []
      };
    },
    created() {
      this.loadData();
      console.log("created");
    },
    mounted() {
      this.addData();
      this.loadData();
      this.drawLine();
      console.log("mounted");
      this.timer = window.setInterval(this.addData, 1000); //每30秒更新实时数据到折线图
    },
    // vue3中beforeDestroy -> beforeUnmount
    beforeUnmount() {
      window.clearInterval(this.timer);
    },
    methods: {
      /**加载数据
       * @description: 加载数据
       * @param {*}
       * @return {*}
       * @author: M_xd
       */
      loadData() {
        server.loadinfo().then(resopnse => {
          this.serverinfo = resopnse.result.data;
        });
        server.loadmem().then(resopnse => {
          this.servermem = resopnse.result.data;
        });
        server.loadcpu().then(resopnse => {
          this.servercpu = resopnse.result.data;
        });
        server.loadram().then(resopnse => {
          this.serverram = resopnse.result.data;
        });
      },
      /**绘制CPU使用率折线图 */
      drawLine() {
        const cpu_edom = document.getElementById("cpu");
        cpu_edom.removeAttribute("_echarts_instance_");
        this.myChartcpu = echarts.init(cpu_edom);
        this.myChartcpu.setOption(this.cpuOption, true);
        const idle_edom = document.getElementById("idle");
        idle_edom.removeAttribute("_echarts_instance_");
        this.myChartidle = echarts.init(idle_edom);
        this.myChartidle.setOption(this.idleOption, true);
      },
      /**添加实时数据 */
      addData() {
        server
          .loadcpu()
          .then(resopnse => {
            resopnse.result.data.time =
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds();
            if (this.userRate.length > 50) {
              // 移除第一个数据
              this.time.shift();
              this.time.push(resopnse.result.data.time);
              this.systemRate.shift();
              this.systemRate.push(resopnse.result.data.system);
              this.userRate.shift();
              this.userRate.push(resopnse.result.data.user);
            } else {
              this.time.push(resopnse.result.data.time);
              this.systemRate.push(resopnse.result.data.system);
              this.userRate.push(resopnse.result.data.user);
            }
            //重新将数组赋值给myChartcpu
            this.cpuOption.series[0].data = this.systemRate;
            this.cpuOption.series[1].data = this.userRate;
            this.cpuOption.xAxis.data = this.time;
            this.myChartcpu.setOption(this.cpuOption, true);
            // 更新显示字符
            this.servercpu.user = this.userRate[this.userRate.length - 1];
            this.servercpu.system = this.systemRate[this.systemRate.length - 1];
            this.servercpu.idle =
              100 - this.servercpu.user - this.servercpu.system.toFixed(2);
            this.$forceUpdate();
          })
          .catch(() => {
            this.$message({
              message: "服务器登录信息失效！",
              type: "error"
            });
            window.clearInterval(this.timer);
            this.$router.push({ path: "/login" });
          });
        server.loadram().then(resopnse => {
          resopnse.result.data.time =
            new Date().getHours() +
            ":" +
            new Date().getMinutes() +
            ":" +
            new Date().getSeconds();
          if (this.idleRate.length > 50) {
            // 移除第一个数据
            this.time2.shift();
            this.time2.push(resopnse.result.data.time);
            this.idleRate.shift();
            this.idleRate.push(resopnse.result.data.idle);
          } else {
            this.time2.push(resopnse.result.data.time);
            this.idleRate.push(resopnse.result.data.idle);
          }
          //重新将数组赋值给myChartcpu
          this.idleOption.series[0].data = this.idleRate;
          this.idleOption.xAxis.data = this.time2;
          this.myChartidle.setOption(this.idleOption, true);
          // 更新显示字符
          this.serverram.idle = this.idleRate[this.idleRate.length - 1];
          this.serverram.used = resopnse.result.data.used;
          this.serverram.free = resopnse.result.data.free;
          this.$forceUpdate();
        });
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .linechart {
    //height: 250px;
    height: 100%;
    width: 95%;
  }
  
  .top {
    height: calc(30%);
    .tl {
      width: 100%;
      text-align: left;
      padding: 20px 0 0 40px;
      display: inline;
      float: left;
    }
    .tr {
      width: 100%;
      text-align: left;
      padding: 20px 0 0 40px;
      display: inline;
      float: right;
    }
  }
  .ht {
    font-size: 25px;
    font-weight: 700;
  }
  .center {
    border-top: 1px solid;
    height: calc(35%);
    text-align: left;
    padding: 20px 0 0 40px;
  }
  .el-col {
    height: 33px;
    line-height: 33px;
    padding: 0 5px;
  }
  .left-ul {
    text-align: right;
  }
  .right-ul {
    text-align: left;
  }
  </style>
  