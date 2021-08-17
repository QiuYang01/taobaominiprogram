<template>
  <div>
     
    <!-- <van-empty description="正在开发中..." /> -->
    <div id="panorama"></div>
  </div>
</template>

<script>
require("./pannellum")
export default {

  data () {
    return {
      
    }
  },
  mounted() {
    console.log("wx",wx)
    // this.initPannellum()
    const query = wx.createSelectorQuery()                // 创建节点查询器 query
    console.log("dom",query.select('#panorama'))
  },
  methods: {
    initPannellum(){
      wx.pannellum.viewer('panorama', {
        "default": {
            "firstScene": "home",
            "author": "QY",
            "sceneFadeDuration": 1000,
            "autoLoad": true,
            "title": "软件联盟",// 左下角会出现标题
        },
        //一个图片
        "scenes": {
            "home":{
                "autoLoad": true, //自动加载
                "type": "equirectangular", // scene 全景展示图片方式（基本全景图配置）
                "panorama": "https://profile.csdnimg.cn/C/1/0/3_ljc_563812704",
                "compass": true,// 添加指南针
                "northOffset": 300,// 指定北偏移量
            
            },
          }
       });
    },


  }

  
}
</script>

<style>

</style>
