/**
 * @authors remy
 * @creatTime 2019-03-11 19:40:22
 * @description 左侧菜单相关接口
 * @version 0.0.1
 */

import { apiRequest } from './index';
import { apiRequest as apiRequest2, formatParams } from './common';

export function getData(userId) {
  // return apiRequest2({
  //   url: '/user/findByUserId?userId=' + sessionStorage.userId,
  //   options: {
  //     method: 'get'
  //   }
  // });
  return apiRequest({
    code: 0,
    data: [
      {
        menuName: '基础信息',
        iconClass: 'baseIcon',
        children: [
          { menuName: '隐患点管理', menuPath: '/hideDangerPoint' },
          { menuName: '监测点管理', menuPath: '/monitorPoint' },
          { menuName: '设备管理', menuPath: '/device' },
          { menuName: '地图标注', menuPath: '/mapLabel' }
        ]
      },
      {
        menuName: '数据分析与报表',
        iconClass: 'analysisIcon',
        children: [
          { menuName: '数据分析', menuPath: '/dataAnalysis' },
          { menuName: '监测报表', menuPath: '/monitorReport' },
					{ menuName: '数据查询', menuPath: '/dataQuery' }
        ]
      },
      {
        menuName: '预警',
        iconClass: 'warningIcon',
        children: [
          { menuName: '预警查询', menuPath: '/earlyWarning' },
          { menuName: '预警设置', menuPath: '/warningSet' },
					{ menuName: '手动预警', menuPath: '/warningManual' }
        ]
      },
      {
        menuName: '应急指挥',
        iconClass: 'commandIcon',
        children: [
          { menuName: '抢险救灾人员', menuPath: '/heros' },
          { menuName: '物资仓库', menuPath: '/storage' },
        ]
      },
      {
        menuName: '系统管理',
        iconClass: 'userIcon',
        children: [
          { menuName: '用户管理', menuPath: '/user' },
          { menuName: '角色管理', menuPath: '/role' },
          { menuName: '操作日志', menuPath: '/log' },
					{ menuName: '消息通知', menuPath: '/message' }
        ]
      }
    ]
  });
}

export function getAllData() {
  return apiRequest2({
    url: '/menu/findAll',
    options: {
      method: 'get'
    }
  });
  return apiRequest({
    code: 0,
    data: [
      {
        id: 1,
        menuName: '基础信息',
        iconClass: 'baseIcon',
        children: [
          { id: 2, menuName: '隐患点管理', menuPath: '/hideDangerPoint' },
          { id: 3, menuName: '监测点管理', menuPath: '/monitorPoint' },
          { id: 4, menuName: '设备管理', menuPath: '/device' },
          { id: 5, menuName: '地图标注', menuPath: '/' }
        ]
      },
      {
        id: 6,
        menuName: '数据分析与报表',
        iconClass: 'analysisIcon',
        children: [
          { id: 7, menuName: '数据分析', menuPath: '/' },
          { id: 8, menuName: '监测报表', menuPath: '/' }
        ]
      },
      {
        id: 9,
        menuName: '预警',
        iconClass: 'warningIcon',
        children: [
          { id: 10, menuName: '预警查询', menuPath: '/earlyWarning' },
          { id: 11, menuName: '预警设置', menuPath: '/' }
        ]
      },
      {
        id: 12,
        menuName: '应急指挥',
        iconClass: 'userIcon',
        children: [
          { id: 13, menuName: '抢险救灾人员', menuPath: '/' },
          { id: 14, menuName: '物资仓库', menuPath: '/' },
          { id: 15, menuName: '人员疏散路线示意图', menuPath: '/' }
        ]
      },
      {
        id: 16,
        menuName: '系统管理',
        iconClass: 'userIcon',
        children: [
          { id: 17, menuName: '用户管理', menuPath: '/user' },
          { id: 18, menuName: '操作日志', menuPath: '/log' }
        ]
      }
    ]
  });
}