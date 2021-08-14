<template>
  <div @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
    <div v-if="dsb">
      <calc></calc>
    </div>
    <div v-else>
      <van-toast id="van-toast" />
      <van-transition duration="300" :show="showSearch&&!drawer&&dsb" name="fade">
        <div class="search-head">
          <!-- <header class="typing" align="center">请输入商品名称进行搜索</header> -->
          <van-search background="#214592"  use-action-slot v-model="searchWords" placeholder="请输入您需要的商品" @change="search" clearable @search="search" >
          <van-button custom-style="height:33px" @click="drawer = true" slot="action" size="small"  icon="wap-nav"></van-button>
          </van-search>
        </div>
      </van-transition>
      <div class="goodContainer">
        <van-card v-for="good in goodsList" 
          :key="good.item_id" 
          style="display: flex;margin: 10px 5px;padding:5px 3px;"
          :thumb="good.white_image"
          :id="good.item_id" >
          <div class="gooodleft"> 
            <van-image radius="10"  v-if="good.white_image" :src='good.white_image' width="100" height="90" @click="previewImage(good.white_image,good.small_images)"></van-image>
            <van-image  radius="10" v-else :src="good.small_images?good.small_images.string[0]:''" width="100" height="90" @click="previewImage(good.small_images.string[0],good.small_images)"></van-image>
            <!-- <van-image  :src="good.small_images?good.small_images.string[1]:''" width="100" height="80" @click="previewImage"></van-image> -->
            <!-- <span class="itemdesc ">总量/剩余 {{good.coupon_total_count}}/{{good.coupon_remain_count}}</span> -->
            <span class="itemdesc" style="font-weight:600;font-size:0.7em;font-weight:200">【{{good.shop_title}}】</span>
        </div>
          <div class="goodright">
            <span @click="linktodetail(good)" style="text-decoration:underline;color:#358CD6;font-weight:600;font-size:1.1em">{{good.short_title}}</span>
            <div class="bottom clearfix">
              <div class="itemdesc ">
                <span class="small_border">{{good.real_post_fee==0?'包邮':'不包邮'}}</span>
                <span class="small_border">{{good.provcity}}</span>
                <span class="small_border ">30天卖{{good.volume}}</span>
                <span style="border:1px solid #007ACC" v-if="good.coupon_share_url" class="small_border ">有隐藏优惠券</span>
              </div>
              <span class="itemdesc cur_price">￥{{good.zk_final_price}}  <b v-if="good.coupon_amount" class="coupon">{{good.coupon_amount}}元券</b></span>
              <van-button type="primary" round  plain hairline  size="small" @click="addToCompareList(good)">加对比</van-button>
              &nbsp;
              &nbsp;
              <van-button style="float:right" type="info" round    size="small"  @click="spreadGet(good)">复制链接</van-button>
            </div>
          </div>
        </van-card>
      </div>

      <!-- 对比的按钮 -->
      <div class="cart-container" v-if="dsb" @click="showcompareTableDialog=true" v-show="!showcompareTableDialog">
        <div class="num">{{compareList.length}}对比</div>
        <div class="circle"></div>
      </div>

      <!-- 下一页 -->
      <div class="change_page_container">
        <!-- <el-select v-model="pageSize" placeholder="请选择" @change="changepagesize" style="width:110px">
          <el-option
            v-for="item in pageoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <!-- <van-button type="primary" @click="changePage(-1)" :disabled="currentPage<=1" icon="el-icon-arrow-left">上一页</van-button>
        <van-button type="primary" @click="changePage(1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></van-button> -->
        <p ref="getmore" v-if="dsb" style="text-align:center;font: font-size:0.8em;color:#338FFF" @click="changePage(1)">点击加载更多...</p>
      </div>

      <!-- 筛选的滑出框 -->
      <van-popup
        :show="drawer"
        position="right"
        close-on-click-overlay
        round
        custom-style="height: 100%;width:60%;z-index:10000;padding:10px"
        >
        <p  class="drawer-title"> 筛选条件 </p>
        <div class="drawer-content">
          <div class="drawer-content-item">
            <span class="drawer-content-item-title">海外商品</span>
            <van-switch
              :checked="isOverseas"
              active-color="#07c160"
              inactive-color="#DCDEE0"
              @change="onChangeswitchisOverseas"
            >
            </van-switch>
          </div>
          <div class="drawer-content-item">
            <span class="drawer-content-item-title">天猫商品</span>
            <van-switch
              :checked="isTmall"
              active-color="#07c160"
              inactive-color="#DCDEE0"
              @change="onChangeswitchisTmall"
            >
            </van-switch>
          </div>
          <div class="drawer-content-item">
            <span class="drawer-content-item-title">包邮商品</span>
            <van-switch
              :checked="needFreeShipment"
              active-color="#07c160"
              inactive-color="#DCDEE0"
              @change="onChangeswitchneedFreeShipment"
            >
            </van-switch>
          </div>
          <div class="drawer-content-item">
            <span class="drawer-content-item-title">价格</span>
            <van-field
              size="small"
              placeholder="上限"
              style="width:100px"
              min="0"
              border
              center
              v-model="startPrice"
              @confirm="conSearch"
              @change="changestartPrice">
            </van-field>
              &nbsp;_&nbsp; 
            <van-field
              v-model="endPrice"
              @change="changeendPrice"
              size="small"
              style="width:100px"
              min="0"
              border
              center
              placeholder="上限"
              @confirm="conSearch"
              >
            </van-field>
          </div>
          <div class="drawer-content-item" style="width:100%;padding-top:60px;display:block"   >
            <van-button  size="large"  color="#7232dd" @click="conSearch">搜 索</van-button>
          </div>
        </div>
      </van-popup>
      <!-- 1{{goodsList}} -->
    </div>
  </div>
</template>

<script>
import "./index.css"
import store from "./store"
import calc from "./calcurate"
export default {
  components:{calc},
   data () {
    return {
      dsb:true,
      checked: true,
      drawer:false, //控制右边弹出的弹框
      name:"sdfs",
      searchWords:'键盘', //搜索的关键字
      isOverseas:false, //搜索条件 是否海外商品
      isTmall:false, //搜索条件 是否天猫商品
      needFreeShipment:false, //搜索条件 是否包邮
      startPrice:1, //搜索条件 折扣价范围下限
      endPrice:100, //搜索条件-折扣价范围上限

      tableloading:false, //加载的遮罩层的显示
      goodsList:[], //商品列表
      showcompareTableDialog:false, //显示对比结果的弹框
      showResultDialog:false, //显示生成淘链接的结果的弹框
      currentUrl:'', //当前商品的url

      compareList:[], //需要对比的商品列表

      //分页用
      currentPage: 1, // 当前页码
      pageSize: 30, // 每页的数据条数
      pageoptions:[
        {
          value:10,
          label:"每页10条"
        },
        {
          value:20,
          label:"每页20条" 
        },
        {
          value:30,
          label:"每页30条"
        },
        {
          value:50,
          label:"每页50条"
        },
        {
          value:80,
          label:"每页80条"
        }
      ],
      //监听滚动用
      touchS:[],
      touchE:[],
      //控制是否显示搜索框
      showSearch:true,
      initdata:[],
    }
  },
  mounted() {
    this.getinitdata();
    // this.search();
    console.log("store",store)
  },
  methods: {
    initpage(){
      //设置title
      wx.setNavigationBarTitle({
        title: this.initdata.pageTitle
      })
      wx.setTabBarItem({
        index: 0,
        text: this.initdata.tabBarItemText,
      })
      
    },
    getinitdata(){
      this.$http.get("init")
      .then(res =>{
        console.log(res);
        this.initdata = res.data.data;
        if(res.data.data.userName==="dog"){
          this,this.initpage();
        }else{
          this,this.initpage();
          this.dsb = false;
          this.search();
        }
      })
    },
    //跳转到商品详细界面
    linktodetail(goods){
      // console.log(encodeURIComponent(JSON.stringify(goods)))
      wx.navigateTo({ //跳转到商品详情
        url: `/pages/detail/main?goods=`+encodeURIComponent(JSON.stringify(goods))
      })
    },
    // 改变价格
    changestartPrice(event){
      // console.log(event.mp.detail)
      this.startPrice = event.mp.detail
    },
    changeendPrice(event){
      this.endPrice = event.mp.detail
    },
    //右边弹出弹框查询
    conSearch(){
      if(this.startPrice=='' || this.endPric==''){
        this.$Toast.fail('请填写价格区间');
        return 
      }
      this.search();
      this.drawer = false;
    },
    //监听滑动
    touchStart: function(e){
      // console.log(e.touches[0].pageX)
      let sx = e.touches[0].pageX
      let sy = e.touches[0].pageY
      this.touchS = [sx,sy]
    },
    touchMove: function(e){
      let sx = e.touches[0].pageX;
      let sy = e.touches[0].pageY;
      this.touchE = [sx, sy]
    },
    touchEnd: function(e){
      let start = this.touchS
      let end = this.touchE
      // console.log(start)
      // console.log(end)
      if(start[1] < end[1] - 30){
        // console.log('下滑')
        this.showSearch = true;
      }else if(start[1] > end[1] + 30){
        // console.log('上滑')
        this.showSearch = false;
      }else{
        // console.log('静止')
      }
    },
    
    //加载下一页
    changePage(index){
      this.currentPage = this.currentPage + index;
      this.search("append");
    },
    //图片预览
    previewImage(url,urllist){
      console.log(urllist)
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: urllist.string // 需要预览的图片http链接列表
      })
    },
    //switch开关改变筛选条件
    onChangeswitchisOverseas(event) {
      // console.log(event.mp.detail)
      this.isOverseas = event.mp.detail
    },
    onChangeswitchisTmall(event) {
      console.log(event.mp.detail)
      this.isTmall = event.mp.detail
    },
    onChangeswitchneedFreeShipment(event) {
      console.log(event.mp.detail)
        this.needFreeShipment = event.mp.detail;
      
    },
    //搜索
    search(event){
      // console.log(event)
      if(event&&event!='append'){
        this.searchWords = event.mp.detail
      }
      wx.showLoading({
        title: '加载中',
        mask:true,
      })
      var quertParams = { //准备好查询参数
        q:this.searchWords,
        pageSize:this.pageSize,
        currentPage:this.currentPage,
        isOverseas:this.isOverseas,
        isTmall:this.isTmall,
        needFreeShipment:this.needFreeShipment,
        startPrice:this.startPrice,
        endPrice:this.endPrice,
      };
      if(!this.searchWords){
        quertParams.q = "纸巾"
      }
      this.$http.get("search?"+this.urlEncode(quertParams))
      .then(res =>{
        // console.log(res)
        if(!res.data.data){
            this.$Toast.fail('获取数据失败了');
            wx.hideLoading()
            return 
        }
        console.log(JSON.parse(res.data.data))
        if(event=='append'){ //点击加载更多，数据接起来
          this.goodsList.push.apply(this.goodsList,JSON.parse(res.data.data).tbk_dg_material_optional_response.result_list.map_data)
        }else{
          this.goodsList = JSON.parse(res.data.data).tbk_dg_material_optional_response.result_list.map_data
        }
        wx.hideLoading()
      })
      .catch(err =>{
        console.log(err)
        this.$Toast.fail('获取数据失败了');
        wx.hideLoading()
      })
    },
    /** 
     * param 将要转为URL参数字符串的对象 
     * key URL参数字符串的前缀 
     * encode true/false 是否进行URL编码,默认为true 
     *  
     * return URL参数字符串 
     */  
    urlEncode(param, key, encode){
        if(param==null) return '';  
        var paramStr = '';  
        var t = typeof (param);  
        if (t == 'string' || t == 'number' || t == 'boolean') {  
          paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);  
        } else {  
          for (var i in param) {  
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);  
            paramStr += this.urlEncode(param[i], k, encode);  
          }  
        }  
        return paramStr;  
    },
    //移除商品列表中的一个商品
    deleteCompareList(item_id){
      // console.log(item_id);
      for(let i=0; i<this.compareList.length; i++){
        if(item_id==this.compareList[i].item_id){
          this.compareList.pop(this.compareList[i])
          return
        }
      }
    },
    //增加商品到对比列表
    addToCompareList(good){
      //避免重复添加
      for(let i=0; i<this.compareList.length; i++){
        if(good.item_id==this.compareList[i].item_id){
          return
        }
      }
      this.compareList.unshift(good);
    },

    //把url换为短链接
    spreadGet(good){
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



  },
}
</script>

<style scoped>

</style>
