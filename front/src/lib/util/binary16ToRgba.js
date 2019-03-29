/**
 * @authors remy
 * @creatTime 2019-03-21 18:45:35
 * @description 将16进制颜色值转换为rgba格式
 * @version 0.0.1
 */

const _map = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, 'a': 10, 'b': 11,
  'c': 12, 'd': 13, 'e': 14, 'f': 15
};

// val: '#0ff' or'#2548fe'
/**
 * @param val { String } '#0ff' or'#2548fe'
 * @param opacity { Number } 0~1
 */
export default function format(val, opacity = 1){
  if(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)){
    val = val.substr(1).toLowerCase();
    const time = val.length / 3;
    let result = ['rgba('];
    for(let i = 0; i < 3; i++){
      const temp = val.substr(i * time, time);
      time === 1 && (temp += temp);
      if(i === 0){
        result[0] = result[0] + (_map[temp[0]] * 16 + _map[temp[1]]);
      }else{
        result.push(_map[temp[0]] * 16 + _map[temp[1]]);
      }
    }
    result.push(opacity + ')');
    return result.toString();
  }else{
    throw new Error('16进制颜色值转换为rgba格式时参数不符合规范');
  }
}