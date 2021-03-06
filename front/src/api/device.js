/**
 * @authors remy
 * @creatTime 2019-03-12 14:38:23
 * @description 监测仪器相关接口
 * @version 0.0.1
 */

import { apiRequest } from './common';

export function getData(query){
  return apiRequest({
   url: '/jcca08a/findByPage',
   options: {
     method: 'post',
     data: JSON.stringify(query)
   }
  });
}
export function saveData(type,data){ 
	return apiRequest({
		url: `/jcca08a/${type}`,
		options: {
		  method: 'post',
		  data: JSON.stringify(data)
		}
	})
}
export function deleteData(ids){
	return apiRequest({
		 url: '/jcca08a/delete?id='+ids,
		 options: {
		   method: 'get'
		 }
	});
}