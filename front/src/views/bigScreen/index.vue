<template>
  <div class="big-screen">
    <div class="head">
      <div class="title"></div>
      <div class="head-con">
        <Input search @on-search="search"></Input>
        <div class="weather">
          <div class="today">
            <weather></weather>
          </div>
          <div class="weather-box">
            <weather></weather>
          </div>
        </div>
        <div class="userInfo">
          <div class="username">admin</div>
          <div class="status">在线</div>
        </div>
        <a href="/#/">
          <div class="goCtrlCenter"></div>
        </a>
      </div>
    </div>
    <div id="map-container"></div>
    <left-con :deviceData="deviceData" :shiftChartArr="shiftChartArr" :gnssChartArr="gnssChartArr" :rainfallChartArr="rainfallChartArr"></left-con>
    <right-top-con :warningMonitor="warningMonitor" :msgNotice="msgNotice"></right-top-con>
    <div class="right-bottom-con">
      <div class="layer-ctrl">
        <Icon type="logo-buffer" title="图层" />
        <div class="layer-box">
          <div class="layer-con">
            <div class="item bottom">
              <Checkbox :value="showItems[0]" @on-change="updateShowItems(0)">隐患点</Checkbox>
            </div>
            <div class="item bottom left">
              <Checkbox :value="showItems[1]" @on-change="updateShowItems(1)">监测点</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="showItems[2]" @on-change="updateShowItems(2)">地图标注</Checkbox>
            </div>
            <div class="item left">
              <Checkbox :value="showItems[3]" @on-change="updateShowItems(3)">区域边界</Checkbox>
            </div>
          </div>
        </div>
      </div>
      <div class="go-home" id="goHomeBtn">
        <Icon type="md-locate" title="回到初始化位置" />
      </div>
      <div class="measure" id="measureBtn" title="测距离"></div>
      <div class="polygon" id="polygonBtn" title="测面积"></div>
    </div>
    <div class="fenceInfoWindow">
      <div class="infoWindow-con">
        <i class="angle angle-top-left"></i>
        <i class="angle angle-bottom-left"></i>
        <i class="angle angle-bottom-right"></i>
        <i class="angle angle-top-right"></i>
        <div class="infoWindow-head">
          <span>标注点</span>
          <Icon type="ios-close" @click="closeOverlay('fenceInfo')"></Icon>
        </div>
        <div class="infoWindow-body">
          <div class="name">{{selectedFence.flagName}}</div>
          <div>
            <div>
              <span class="_title">备注：</span>
              <div class="_content" v-text="selectedFence.flagDes || '无'"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="geoPointInfoWindow">
      <div class="infoWindow-con">
        <i class="angle angle-top-left"></i>
        <i class="angle angle-bottom-left"></i>
        <i class="angle angle-bottom-right"></i>
        <i class="angle angle-top-right"></i>
        <div class="infoWindow-head">
          <span>{{selectedGeoPoint.typeCode == 0 ? '监测点' : '隐患点'}}</span>
          <Icon type="ios-close" @click="closeOverlay('geoPointInfo')"></Icon>
        </div>
        <div class="infoWindow-body">
          <div class="name">{{selectedGeoPoint.name}}</div>
          <div v-if="selectedGeoPoint.typeCode == 0">
            <div>
              <span class="_title">监测要素</span>
              <div class="_content">{{selectedGeoPoint.dictType}}</div>
            </div>
            <div>
              <span class="_title">所属隐患点</span>
              <div class="_content">xxxxxxxxxxx</div>
            </div>
            <div>
              <span class="_title">联络人</span>
              <div class="_content">xxxxxxxxxxx</div>
            </div>
            <div>
              <span class="_title">联络方式</span>
              <div class="_content">xxxxxxxxxxx</div>
            </div>
          </div>
          <div v-else>
            <div>
              <span class="_title">类型</span>
              <div class="_content">{{selectedGeoPoint.dictType}}</div>
            </div>
            <div>
              <span class="_title">地理位置</span>
              <div class="_content">xxxxxxxxxxx</div>
            </div>
            <div>
              <span class="_title">威胁对象</span>
              <div class="_content">xxxxxxxxxxx</div>
            </div>
          </div>
          <div class="infoWindow-btns">
            <a href="/#/dataAnalysis"><span>数据分析</span></a>
            <a href="/#/earlyWarning"><span>预警查询</span></a>
          </div>
        </div>
      </div>
    </div>
    <audio id="alramAudio" loop src="./audio/alarm.mp3"></audio>
  </div>
</template>
<script>
import './index.less';
import { startupWebSocket } from '@/api/common';
import Weather from '@/components/Weather';
import LeftCon from './leftCon';
import RightTopCon from './rightTopCon';
import MapTool from '@/lib/ol/mapTool';
import { adaptFontSize } from '@/common/other';
export default {
  components: {
    Weather,
    LeftCon,
    RightTopCon
  },
  data(){
    return {
      deviceData: [],
      shiftChartArr: [],
      gnssChartArr: [],
      rainfallChartArr: [],
      warningMonitor: {},
      msgNotice: [],
      showItems: [true, true, true, true], // 右下角图层对应[隐患点，监测点，地图标注，区域边界]
      selectedGeoPoint: {},
      selectedFence: {}
    };
  },
  beforeCreate(){
    adaptFontSize();
    window.addEventListener('resize', adaptFontSize);
    // const isLogin = sessionStorage.token && sessionStorage.refreshToken && sessionStorage.userId;
    // if (!isLogin) {
    //   window.location.href = window.location.protocol + '//' + window.location.host + '/login';
    // }
  },
  created(){
    // 不需要监听的属性
    this.mapTool = new MapTool({
      isFitToAllGeos: false,
      mousePosition: false,
      measure: true,
      polygon: true,
      showFenceArea: true,
      isShowBoundary: true,
      hasFloatLayer: true
    });
    this.alramAudio = null;
  },
  mounted(){
    this.alramAudio = document.getElementById('alramAudio');
    // 重写mapTool.addControl
    this.mapTool.addControl = ({className, onclick}) => {
      const btn = document.getElementById(className + 'Btn');
      btn.addEventListener('click', onclick.bind(this.mapTool), false);
    }
    // 初始化地图
    this.mapTool.init(document.getElementById('map-container'), 'googleSatellite');
    this.bindInfoWindow();

    // // 图表demo数据
    // this.initCharts();
    // // 预警监控demo数据
    // this.initWarning();
    // // 地图隐患点、监测点、标注点demo数据
    // this.initMapData();

    // 启动websocket
    startupWebSocket(data => {
      // code100-监测设备正常、异常统计
      if(data.result === 100){
        this.deviceData = data.data;
      }
      // code101-查询GNSS报表数据
      // code102-查询所有设备数据
      // code103-查询地图标注数据
      if(data.result === 103){
        data.data.forEach(item => {
          this.mapTool.addFence({
            ...item,
            posCoordinateSystem: 0,
            enabled: true,
            fencePointData: item.flagPositions
          });
        });
      }
    });
  },
  destroyed(){},
  methods: {
    initCharts(){
      this.shiftChartArr = [
        {
          id: 1,
          name: '拉线位移器监测11'
        },
        {
          id: 2,
          name: '拉线位移器监测22'
        },
        {
          id: 3,
          name: '拉线位移器监测33'
        }
      ];
      this.gnssChartArr = [
        {
          id: 1,
          name: 'GNSS表面位移监测11'
        },
        {
          id: 2,
          name: 'GNSS表面位移监测22'
        }
      ];
      this.rainfallChartArr = [
        {
          id: 1,
          name: '降雨量实时监测11'
        },{
          id: 2,
          name: '降雨量实时监测22'
        }
      ];
    },
    initWarning(){
      this.warningMonitor = {
        num1: 102,
        num2: 32,
        num3: 5,
        num4: 1
      };
      this.msgNotice = [
          {id:1,level:0,content:'头：正常1'},
          {id:2,level:1,content:'注意级预警1'},
          {id:3,level:2,content:'警示级预警1'},
          {id:4,level:3,content:'警戒级预警1'},
          {id:5,level:4,content:'报警级预警1'},
          {id:6,level:1,content:'注意级预警2'},
          {id:7,level:2,content:'警示级预警2'},
          {id:8,level:3,content:'尾：警戒级预警2'}
        ];
      setTimeout(() => {
        this.msgNotice = [
          {id:1,level:0,content:'头：正常1'},
          {id:2,level:1,content:'注意级预警1'},
          {id:3,level:2,content:'警示级预警1'},
          {id:4,level:3,content:'警戒级预警1'},
          {id:5,level:4,content:'报警级预警1'},
          {id:6,level:1,content:'注意级预警2'},
          {id:7,level:2,content:'警示级预警2'},
          {id:8,level:3,content:'尾：警戒级预警2'},
          {id:9,level:4,content:'新增：报警级预警2'},
          {id:10,level:1,content:'新增：注意级预警3'},
          {id:11,level:2,content:'新增：警示级预警3'},
          {id:12,level:3,content:'新增：警戒级预警3'}
        ];
      }, 20*1000);
    },
    initMapData(){
      const geos = [
        {id: 1, typeCode: 0, lng: 102.25,lat: 28.15, name: '001号监测点', dictType: '降雨量'},
        {id: 2, typeCode: 1, lng: 102.45,lat: 28.25, name: '001号隐患点', dictType: '滑坡'},
        {id: 3, typeCode: 2, lng: 102.58,lat: 28.32, name: '002号隐患点', dictType: '泥石流'},
        {id: 4, typeCode: 1, lng: 102.3,lat: 28.12, name: '003号隐患点', dictType: '滑坡'},
        {id: 5, typeCode: 2, lng: 102.47,lat: 28.18, name: '004号隐患点', dictType: '泥石流'},
        {id: 6, typeCode: 0, lng: 102.62,lat: 28.23, name: '002号监测点', dictType: '降雨量', warnState: false}
      ];
      const fences = [{
        id: 1,
        name: '001号标注点',
        posCoordinateSystem: 0,
        enabled: true,
        fencePointData: '102.35,28.1;102.5,28.1;102.5,28;102.35,28;102.35,28.1'
      }];
      this.mapTool.loadGeos(geos);
      this.mapTool.loadFences(fences);
      geos.find(item => item.warnState) && this.alramAudio.play();
    },
    search(value){
      let result = Object.keys(this.mapTool.geoPoints).find(id => {
        const geoPoint = this.mapTool.geoPoints[id];
        if(geoPoint && geoPoint.data.name === value){
          this.mapTool.fitToCoords([geoPoint.getCoordinate()]);
          this.selectedGeoPoint = geoPoint;
          this.mapTool.showInfoWindow(geoPoint, 'geoPointInfo');
          return true;
        }
      });
      if(!result){
        result = Object.keys(this.mapTool.fences).find(id => {
          const fence = this.mapTool.fences[id];
          if(fence && fence.data.name === value){
            this.mapTool.fitToCoords(fence.getCoordinates());
            this.selectedFence = fence;
            this.mapTool.showInfoWindow(fence, 'fenceInfo');
            return true;
          }
        });
      }
      !result && this.$Message.info('目标不存在');
    },
    closeOverlay(target){
      this.mapTool.hideInfoWindow(target);
    },
    bindInfoWindow(){
      this.mapTool.bindInfoWindow({
        geoPoint: {
          infoWindows: [
            {
              type: 'Info',
              element: this.$el.eChildren('.geoPointInfoWindow')[0]
            }
          ],
          selectedCallback: (geoPoint) => {
            this.selectedGeoPoint = Object.assign({}, geoPoint.data);
          }
        },
        fence: {
          infoWindows: [
            {
              type: 'Info',
              element: this.$el.eChildren('.fenceInfoWindow')[0]
            }
          ],
          selectedCallback: (fence) => {
            this.selectedFence = Object.assign({}, fence.data);
          }
        }
      });
    },
    updateShowItems(index){
      this.showItems[index] = !this.showItems[index];
      this.showItems.forEach((flag, i) => {
        switch(i){
          case 0:
          // 隐患点
          this.toggleMapItem(flag, 1);
            break;
          case 1:
          // 监测点
          this.toggleMapItem(flag, 0);
            break;
          case 2:
          // 地图标注
          this.toggleMapItem(flag, 2);
            break;
          case 3:
          // 区域边界
          this.toggleMapItem(flag, 3);
            break;
        }
      });
    },
    toggleMapItem(flag, type){
      try{
        if(type === 0 || type === 1){
          const geoPoints = this.mapTool.geoPoints;
          Object.keys(geoPoints).forEach(id => {
            const geoPoint = geoPoints[id];
            const typeCode = geoPoint.data.typeCode;
            if((type === 0 && typeCode == 0) || (type === 1 && (typeCode == 1 || typeCode == 2))){
              flag ? geoPoint.show() : geoPoint.hide();
              if(flag){
                geoPoint.show();
              }else{
                geoPoint.hide();
                geoPoint.data.id === this.selectedGeoPoint.id && this.mapTool.hideInfoWindow('geoPointInfo');
              }
            }
          });
        }else if(type === 2){
          const fences = this.mapTool.fences;
          Object.keys(fences).forEach(id => {
            const fence = fences[id];
            if(flag){
              fence.show();
            }else{
              fence.hide();
              this.mapTool.hideInfoWindow('fenceInfo');
            }
          });
        }else if(type === 3){
          flag ? this.mapTool.showBoundary() : this.mapTool.hideBoundary();
        }
      }catch(err){}
    },
    handleAlarm(){
      this.alramAudio.pause();
    }
  }
}
</script>
<style lang="less">
@font-face{
  font-family: 'MyFont';
  src: url('../../assets/font/pangmen.otf');
  src: url('../../assets/font/pangmen.woff');
  src: url('../../assets/font/pangmen.ttf');
}
html{
  overflow: hidden;
}
.big-screen{
  .level0-color{
    color: #00FB5A;
  }
  .level1-color{
    color: #E0E31A;
  }
  .level2-color{
    color: #E19A00;
  }
  .level3-color{
    color: #e14a00;
  }
  .level4-color{
    color: #FF0006;
  }
  .left-con, .right-top-con{
    .ivu-icon-md-rewind{
      position: absolute;
      top: -2.4rem;
      width: 1.6rem;
      height: 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      text-align: center;
      line-height: 1rem;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .ivu-icon-md-rewind.left{
    }
    .ivu-icon-md-rewind.right{
      transform: rotate(180deg);
    }
  }
  .head{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999999;
    height: 3.5rem;
    color: #fff;
    .title{
      float: left;
      width: 14.3rem;
      height: 100%;
      background-image: url(/img/logo.d4c67ca4.png);
      background-position: 0.7rem 0.8rem;
      background-size: 93%;
      background-repeat: no-repeat;
    }
    .head-con{
      height: 3.5rem;
      line-height: 3.5rem;
      text-align: right;
      margin-left: 15.8rem;
      margin-right: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      &>*{
        display: inline-block;
        vertical-align: middle;
      }
      .ivu-input-wrapper{
        width: 14rem;
        margin-right: 1.3rem;
        .ivu-input-icon{
          width: 1.8rem;
          height: 1.8rem;
          line-height: 1.8rem;
        }
        .ivu-input{
          height: 1.8rem;
          border-radius: 0.9rem;
        }
      }
      .weather{
        width: 5rem;
        height: 100%;
        position: relative;
        .today{
          width: 100%;
          height: 100%;
          overflow: hidden;
          >iframe{
            height: 3.2rem;
            margin-top: 0.3rem;
            margin-left: -75px;
          }
        }
        .weather-box{
          display: none;
          position: absolute;
          left: -224px;
          top: 3.5rem;
          overflow: hidden;
          >iframe{
            margin-left: -187px;
          }
        }
        &:hover{
          .weather-box{
            display: block;
          }
        }
      }
      .userInfo{
        min-width: 5.1rem;
        max-width: 8rem;
        padding-left: 2.5rem;
        margin-left: 1.5rem;
        text-align: left;
        background-image: url(../../assets/header/user.png);
        background-repeat: no-repeat;
        background-position-y: center;
        >div{
          line-height: 1.2rem;
          &.username{
            font-size: 0.7rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &.status{
            color: #02FE20;
            &:before{
              content: '';
              display: inline-block;
              width: 10px;
              height: 10px;
              margin-right: 5px;
              border-radius: 10px;
              background-color: #02FE20;
            }
          }
        }
      }
      .goCtrlCenter{
        margin: 0 0.15rem 0 1rem;
        width: 6.1rem;
        height: 1.8rem;
        background-image: url(../../assets/header/system.png);
        background-size: 100%;
      }
    }
  }
  .right-bottom-con{
    position: absolute;
    right: 2rem;
    bottom: 2.5rem;
    width: 1.3rem;
    height: 6.3rem;
    z-index: 999999;
    >div{
      display: inline-block;
      width: 1.3rem;
      height: 1.3rem;
      line-height: 1.3rem;
      background-color: rgba(255, 255, 255, 0.1);
      vertical-align: bottom;
      margin-top: 0.35rem;
      text-align: center;
      >.ivu-icon{
        font-size: 1rem;
        color: #8D9798;
        cursor: pointer;
      }
      &.layer-ctrl{
        margin-top: 0;
        &:hover{
          background-color: #FF9000;
          .ivu-icon{
            color: #fff;
          }
          .layer-box{
            display: block;
          }
        }
        &>span{
          cursor: pointer;
        }
        .layer-box{
          display: none;
          position: absolute;
          right: 1.3rem;
          top: 0;
          width: 10.6rem;
          text-align: left;
          .layer-con{
            width: 10rem;
            height: 2.6rem;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0.15rem;
            padding: 0.2rem 0.6rem;
            position: relative;
            .item{
              float: left;
              width: 50%;
              color: rgba(255, 255, 255, 0.5);
              line-height: 1.1rem;
              .ivu-checkbox-inner{
                width: 0.7rem;
                height: 0.7rem;
                background-color: #B2B5B5;
              }
              .ivu-checkbox-inner:after{
                width: 0.25rem;
                height: 0.45rem;
                top: 0;
                left: 3px;
                transform: rotate(45deg) scale(1);
              }
              .ivu-checkbox-focus{
                box-shadow: none;
              }
              .ivu-checkbox-checked .ivu-checkbox-inner{
                border-color: #FF9000;
                background-color: #FF9000;
              }
              .ivu-checkbox-wrapper{
                margin-right: 0;
              }
              &.left{
                border-left: 1px solid rgba(255, 255, 255, 0.1);
                padding-left: 0.4rem;
              }
              &.bottom{
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              }
            }
            &:after{
              position: absolute;
              right: -10px;
              top: 3px;
              content: '';
              border: 5px solid transparent;
              border-top-color: rgba(255, 255, 255, 0.1);
              transform: rotate(-90deg);
            }
          }
        }
      }
      &.go-home:hover{
        background-color: #FF9000;
        .ivu-icon{
          color: #fff;
        }
      }
      &.measure{
        cursor: pointer;
        position: relative;
        &:hover{
          background-color: #FF9000;
        }
        &:after{
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-image: url(../../assets/map/measure.png);
          background-size: 0.75rem 0.75rem;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
      &.polygon{
        cursor: pointer;
        position: relative;
        &:hover{
          background-color: #FF9000;
        }
        &:after{
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-image: url(../../assets/map/polygon.png);
          background-size: 0.75rem 0.75rem;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }
}
#map-container{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #021e21;
  .tooltip{
    background-color: rgba(2, 17, 17, 0.5);
    padding: 8px 20px;
    border-radius: 32px;
    line-height: 16px;
    color: #0ff;
    position: relative;
    i{
      position: absolute;
      left: 50%;
      bottom: 0;
      &:after{
        content: ' ';
        position: absolute;
        left: -10px;
        bottom: -20px;
        border: 10px solid transparent;
        border-top-color: #fff;
      }
    }
  }
  .fenceInfoWindow,
  .geoPointInfoWindow,
  .markerInfoWindow {
    position: absolute;
    z-index: 1;
    width: 230px;
    color: #02F1F1;
    .infoWindow-con {
      background: linear-gradient(135deg, transparent 10px, rgba(0,29,29,0.7)0) top left, 
                  linear-gradient(-135deg, transparent 10px, rgba(0,29,29,0.7) 0) top right, 
                  linear-gradient(-45deg, transparent 10px, rgba(0,29,29,0.7) 0) bottom right,
                  linear-gradient(45deg, transparent 10px, rgba(0,29,29,0.7) 0) bottom left;
      background-size: 50% 50%;
      background-repeat: no-repeat;
      position: relative;
      >.angle{
        position: absolute;
        width: 50px;
        height: 50px;
        &.angle-top-left{
          top: 0;
          left: 0;
          background-image: url('../../assets/map/dialog-top-left.png');
        }
        &.angle-top-right{
          top: 0;
          right: 0;
          background-image: url('../../assets/map/dialog-top-right.png');
        }
        &.angle-bottom-right{
          bottom: 0;
          right: 0;
          background-image: url('../../assets/map/dialog-bottom-right.png');
        }
        &.angle-bottom-left{
          bottom: 0;
          left: 0;
          background-image: url('../../assets/map/dialog-bottom-left.png');
        }
      }
      .infoWindow-head {
        height: 36px;
        line-height: 36px;
        padding: 0 24px;
        text-align: right;
        span {
          float: left;
          display: inline-block;
          vertical-align: top;
          font-family: 'MyFont';
          font-size: 18px;
          color: #02F1F1;
          border-bottom: 2px solid #02F1F1;
        }
        .ivu-icon{
          font-size: 30px;
          margin-right: -10px;
          cursor: pointer;
          position: relative;
          z-index: 2;
        }
      }
      .infoWindow-body {
        padding: 14px 24px;
        .name{
          line-height: 26px;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        >div>div {
          font-size: 14px;
          line-height: 22px;
          >span._title {
            float: left;
            color:rgba(2,241,241,0.6);
          }
          >div._content {
            margin-left: 80px;
            word-wrap: break-word;
          }
        }
      }
      .infoWindow-btns {
        text-align: center;
        padding-top: 16px;
        a:first-child{
          margin-right: 33px;
        }
        span {
          display: inline-block;
          width: 71px;
          height: 26px;
          line-height: 26px;
          color: #000;
          background-color: rgba(230,221,10,0.8);
          border-radius: 4px;
          cursor: pointer;
        }
      }
      &:before {
        position: absolute;
        left: 101px;
        bottom: -28px;
        content: '';
        border-width: 14px;
        border-style: solid;
        border-color: transparent;
        border-top-color: rgba(0,29,29,0.7);
      }
      &:after{
        position: absolute;
        left: 103px;
        bottom: -16px;
        content: '';
        width: 24px;
        height: 14px;
        background-image: url('../../assets/map/dialog-arrow.png');
        background-repeat: no-repeat;
      }
    }
  }
  .fenceInfoWindow{
    ._content{
      margin-left: 60px!important;
    }
  }
}
</style>