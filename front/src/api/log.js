/**
 * @authors remy
 * @creatTime 2019-03-12 16:41:08
 * @description 操作日志相关接口
 * @version 0.0.1
 */

import { apiRequest } from './common';

export function getData(query){
  return apiRequest({
    url: '/operationLog/findByPage',
    options: {
      method: 'post',
      data: JSON.stringify(query)
    }
  });
}

export function findById(id){
  return apiRequest({
    url: '/operationLog/findById?id=' + id,
    options: {
      method: 'get'
    }
  });
}