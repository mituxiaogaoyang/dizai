/**
 * @authors remy
 * @creatTime 2019-03-13 14:47:57
 * @description 对话框状态仓库
 * @version 0.0.1
 */

export default {
  namespaced: true,
  // 模块重用：使用一个函数来声明模块
  state(){
    return {
      editVisible: false,
      detailVisible: false,
      mapDetailVisible: false
    };
  },
  mutations: {
    openEdit(state){
      state.editVisible = true;
    },
    closeEdit(state){
      state.editVisible = false;
    },
    openDetail(state){
      state.detailVisible = true;
    },
    closeDetail(state){
      state.detailVisible = false;
    },
    openMapDetail(state){
      state.mapDetailVisible = true;
    },
    closeMapDetail(state){
      state.mapDetailVisible = false;
    }
  }
}