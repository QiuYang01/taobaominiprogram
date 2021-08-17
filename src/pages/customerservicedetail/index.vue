<template>
  <div>
    在线客服 拥有音乐、闲聊、百科等功能。
    <!-- {{communicateList}} -->
    <div class="dialogue">
      <div class="dialogue-item" v-for="item in communicateList" :key="item" >
        <span class="text">{{item.text}}</span>
        <audio 
          v-if="item.music"
          :author="item.music.singer_name"
          :poster="item.music.album_name" 
          :name="item.music.song_name" 
          :src="item.music.music_url" 
          :id="myAudio" 
          controls 
          loop>
        </audio>
        <!-- <audio 
          v-if="item.music"
          :src="item.music.music_url"
          >{{item.music}}</audio> -->
      </div>
    </div>
    <div class="bottom-wrapper">
      <input  class="send-input question-input" @keyup.enter="sendOnlineMessage" type="text" v-model="questiontext" />
      <button class="send-button" :disabled="!questiontext" @click="sendOnlineMessage">发送</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
       weixinAI: 'https://openai.weixin.qq.com/openapi', // 微信机器人 https://developers.weixin.qq.com/doc/aispeech/platform/INTERFACEDOCUMENT.html
      // 微信对话
       WopenAIToken: 'QrQ1AteUMlnEIX689KnoDuvdcUNzor',
       WopenAIEncodingAESKey: 'eYMM4kGGTRDnSSvouafwix0sJXKLoycB9ymyp6sbzjz ',
       signature:'', //获得的签名 
       communicateList:[], //对话
       questiontext:'', //问题
    }
  },
  mounted() {
    wx.setNavigationBarTitle({
        title: "智障客服"
      })
      this.questiontext = "你好呀"
    this.sendOnlineMessage();
  },
  methods: {
    // 发送消息给机器人
    sendOnlineMessage(){
      
      if(!this.signature){
          this.getSignature()
          return
        }
      let url = this.weixinAI + '/aibot/' + this.WopenAIToken;
      let data = {
        query:this.questiontext,
        signature:this.signature
      }
      var _this = this;
      let msg = {
        text:this.questiontext,
        music:'',
        ans_node_id:''
      }
      this.communicateList.push(msg)
      this.questiontext = "";
      wx.request({
          url: `${url}`,
          method: "POST",
          data: JSON.stringify(data),
          header: { 
              'Content-Type': 'application/json; charset=UTF-8',
          },
          success(request) {
              console.log(request)
              if(request.statusCode==200){
                let msg = {
                  text:request.data.answer?request.data.answer:"机器人无语了...",
                  music:'',
                  ans_node_id:''
                }
                if(request.data.answer_type=="music"){ //返回音乐
                  msg.music = request.data.msg[0];
                }
                _this.communicateList.push(msg) ;
                
              }else{

              }
          },
          fail(error) {
              console.log(error);
              wx.showToast({
                title: '这个机器人坏掉了',
                icon: 'error',
                duration: 2000
              })
          }
        })
    },
    //获取签名
    getSignature(){
        let url = this.weixinAI +"/sign/" + this.WopenAIToken;
        let data = {
          userid:1
        };
        var _this = this;
        wx.request({
          url: `${url}`,
          method: "POST",
          data: JSON.stringify(data),
          header: { 
              'Content-Type': 'application/json; charset=UTF-8',
          },
          success(request) {
              console.log(request)
              console.log(_this)
              if(request.statusCode==200){
                _this.signature = request.data.signature;
                _this.sendOnlineMessage();
              }else{

              }
              // console.log("this.signature",_this.signature)
          },
          fail(error) {
              console.log(error)
              wx.showToast({
                title: '这个机器人坏掉了',
                icon: 'error',
                duration: 2000
              })
          }
        })
    },
  
  },
}
</script>
<style scoped>

.bottom-wrapper{
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  border: 2px solid #8A2BE2;
}
.send-input {
  padding: 3px;
  font-size: 18px;
  flex: 5;
  height: auto;
}
.send-button {
  flex: 1;
  background-color: blueviolet;
  border-radius: 0;
}
.dialogue {
  max-height: 85vh;
  overflow: scroll;
  padding-bottom: 5vh;
}
/* 靠右的对话框 */
.dialogue-item:nth-child(odd){
  margin-right: 10px;
  text-align: right;
  position: relative;
  padding: 10px;
}
/* 文字 */
.dialogue-item:nth-child(odd)>.text{
  display: inline-block;
  font-size: 18px;
  color: #fff;
  background-color: #04BE02;
  padding: 8px 6px;
  border-radius: 10px;
  text-align: left;
  word-wrap:break-word;
}
/* 尖角 */
.dialogue-item:nth-child(odd)>.text:after{
		content:" ";
		position:absolute;
		right:0px;
    border-color: transparent #04BE02;
		border-bottom:15px solid #04BE02;
		border-right:15px solid transparent;
		border-top:10px solid transparent;
}
/* 靠左的对话框 */
.dialogue-item:nth-child(even){
  position: relative;
  text-align: left;
  padding: 10px;
  margin-left: 10px;
}
/* 文字 */
.dialogue-item:nth-child(even)>.text{
  display: inline-block;
  font-size: 18px;
  color: #000;
  background-color: #F0F0F0;
  padding: 8px 6px;
  border-radius: 10px;
  text-align: left;
  word-wrap:break-word;
}
/* 尖角 */
.dialogue-item:nth-child(even)>.text:after{
		content:" ";
		position:absolute;
		left:0px;
    border-color: transparent #F0F0F0;
		border-bottom:15px solid #F0F0F0;
		border-left:15px solid transparent;
		border-top:10px solid transparent;
}
</style>