<template>
  <div style="height:100vh;background:#F7F8FA">
    <!-- https://vant-contrib.gitee.io/vant-weapp/#/nav-bar#dai-ma-yan-shi -->
    <van-image fit="none" :src="goods.pict_url" width="400" height="300" @click="previewImage()"></van-image>
    <div class="shop_title">
      <div>{{goods.shop_title}}  <span style="padding-left:10px">{{goods.coupon_info}}</span></div>
    </div>
    <p style="padding:0px 5px">{{goods.title}}|{{goods.item_description}}</p>
    <div class="module-price" >
      <div class="real-price">
        <div class="ui-yen "> ¥ <span>{{goods.zk_final_price}}</span> 
          <p class="item-price">原价格: ¥<span style="text-decoration:line-through;">{{goods.reserve_price}}</span></p>
        </div>
      </div>
    </div>
    <van-cell-group custom-class="cell-group-class">
      <van-cell title="店铺评分" :value="goods.shop_dsr" />
      <van-cell title="销量" :value="goods.volume" />
      <van-cell title="商品邮费" :value="goods.real_post_fee" />
    </van-cell-group>
    <!-- <div style="">
      <span>店铺评分:{{goods.shop_dsr}}</span>
      <span style="float:right">{{goods.volume}}:销量</span>
    </div> -->
    
    <!-- <p>{{goods.tk_total_sales}}</p> -->
    <p></p>

    <!-- 底部一行 -->
    <van-goods-action >
      <van-goods-action-icon icon="chat-o" text="客服" @click="topcustomerservice" />
      <!-- <van-goods-action-icon icon="cart-o" text="购物车" info="5" />
      <van-goods-action-icon icon="shop-o" text="店铺" /> -->
      <van-goods-action-button color="#be99ff" text="好物分享" @click="showShare=true" type="warning" />
      <van-goods-action-button color="#7232dd" text="复制链接" @click="spreadGet" />
    </van-goods-action>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <!-- 分享 -->
    <van-share-sheet
      :show="showShare"
      title="立即分享给好友"
      :options="options"
      @close="showShare=false"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      goods:{}, //传过来的商品
      showShare:false, options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' },
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
        ],
      ],
    }
  },
  onLoad(option) {
  　console.log(JSON.parse(decodeURIComponent(option.goods)))//可以打印一下option看查看参数
    this.goods = JSON.parse(decodeURIComponent(option.goods))
  },
  mounted() {
      wx.setNavigationBarTitle({
      title: '商品详情'
    })
  },
  methods: {
    //去客服
    topcustomerservice(){
      wx.navigateTo({ //跳转到客服
        url: "/pages/customerservicedetail/main"
      })
    },
    backtopage(){
      console.log("返回")
    },
    //图片预览
    previewImage(){
      wx.previewImage({
        current: this.goods.pict_url, // 当前显示图片的http链接
        urls: this.goods.small_images.string // 需要预览的图片http链接列表
      })
    },
    //把url换为短链接
    spreadGet(){
      var good = this.goods;
      console.log(good)
      var coupon_share_url = good.coupon_share_url?good.coupon_share_url:good.url
      console.log("使用的长连链接",coupon_share_url)
      this.$http.get("spreadGet?myUrl="+"https:" +coupon_share_url,)
        .then((res) => {
          console.log(res)
          if(res.data.data.indexOf("error_response")!=-1){
            this.errMsg("生成口令失败，系统异常！")
          }else{
            console.log(JSON.parse(res.data.data).tbk_spread_get_response.results.tbk_spread[0].err_msg);
            if(JSON.parse(res.data.data).tbk_spread_get_response.results.tbk_spread[0].err_msg=="OK"){
              this.tpwdCreate(JSON.parse(res.data.data).tbk_spread_get_response.results.tbk_spread[0].content)
            }else{
              this.errMsg(JSON.parse(res.data.data).tbk_spread_get_response.results.tbk_spread[0])
            }
          }
        })
        .catch((err) => {
          console.log(err)
          this.errMsg(err)
        })
    },
    //生成淘口令 
    tpwdCreate(shortUrl){
      // goodUrl =  "http:" + goodUrl
      // console.log(goodUrl);
      this.currentUrl = shortUrl;
      // const shortUrl = this.spreadGet(goodUrl);
      console.log("获得的短链接",shortUrl);
      this.$http.get("tpwdCreate?shortUrl="+shortUrl,)
        .then((res) => {
          console.log(res)
          if(res.data.data.indexOf("error_response")!=-1){
            this.errMsg("生成口令失败，系统异常！")
          }else{
            this.$Toast.success("复制商品链接成功，打开淘宝即可领券购买。");
            console.log("复制的链接",JSON.parse(res.data.data).tbk_tpwd_create_response.data.model);
            this.setClipboardData(JSON.parse(res.data.data).tbk_tpwd_create_response.data.model)
            // this.copyToClipboard(JSON.parse(res.data.data).tbk_tpwd_create_response.data.model);
            this.showResultDialog = true;
            setTimeout(()=>{
              this.showResultDialog=false
            },5000)
          }
        })
        .catch((err) => {
          console.log(err)
          this.errMsg(err)
        })
        .finally(()=>{
          console.log("结束")

        })
    },

    //复制内容到剪切板
    setClipboardData(str){
      wx.setClipboardData({
        data: str,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }
  }
}
</script>

<style>
.goods-action-custom-class {
  border-top: 1px solid #ccc;
}
.module-price {
  background-color: #FFF;
    padding: 0 10px;
}
.module-price .real-price {
    color: #FF0036;
    height: 36px;
    line-height: 36px;
}
.module-price .item-price {
    display: inline-block;
    font-size: 12px;
    margin-left: 20px;
    color: #888;
    font-family: '\5fae\8f6f\96c5\9ed1';
}
.shop_title {
  width: 100%;
  padding: 10px 5px;
  background-color: #FF1F5B;
  opacity: 0.8;
  position: relative;
  top: -20px;
  font-size: 1.2em;
  font-weight: 600;
}
.van-cell {
  padding-left: 5px !important;
}
</style>
