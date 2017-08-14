<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>{{goods}}</nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur" @click="defaultGoods">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">{{price1}}
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>价格</dt>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked == 'all'}">All</a>
              </dd>
              <dd v-for="(price, index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>

            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in GoodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/img/' + item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">

              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 模态框 -->
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">信息提示</div>
            <button class="md-close">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show">请先登录否则无法加入购物车</span>
              </div>
            </div>
            <div class="login-wrap">
              <a href="javascript:;" class="btn-login" @click="closeModal">关闭</a>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-if="mdShow"></div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import axios from 'axios'
  import NavHeader from '@/components/Header'
  import NavFooter from '@/components/Footer'
  import NavBread from '@/components/NavBread'
  export default {
    name: 'GoodsList',
    data() {
      return {
        GoodsList: Array,
        sortFlag: true,
        busy: true,
        page: 1,
        pagesize: 8,
        goods: '商品',
        price1: '从低到高 ↑',
        priceChecked: 'all',
        mdShow: false,
        priceFilter: [{
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ]
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted: function() {
      this.getGoodsList()
    },
    methods: {
      getGoodsList(flag) {
        let param = {
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked,
          page: this.page,
          pagesize: this.pagesize
        }
        axios.get("/goods/list", {
          params: param
        }).then((result) => {
          console.log(result)
          let res = result.data;
          console.log(res)
          if(res.status === '0') {
            console.log(res.result)
            if(flag) {
              this.GoodsList = this.GoodsList.concat(res.result);
              if(res.result.length === 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.GoodsList = res.result;
              this.busy = false;
            }
          } else {
            alert('系统繁忙')
          }
        })
      },
      sortGoods() {
      	this.page = 1;
      	if (this.sortFlag) {
      		this.price1 = '从高到低 ↓'
      	} else {
      		this.price1 = '从低到高 ↑'
      	}
        this.sortFlag = !this.sortFlag;
        this.getGoodsList();
      },
      defaultGoods() {
      	let param = {
          sort: 0,
          priceLevel: this.priceChecked,
          page: this.page,
          pagesize: this.pagesize
        }
      	axios.get('/goods/list',{params:param}).then( (result) => {
      		console.log('000')
      	})
      },
      setPriceFilter(index) {
      	this.page = 1;
        this.priceChecked = index;
        this.getGoodsList();
      },
      addCart(productId) {
        axios.post('/goods/addCart',{ productId }).then( (result) => {
        	let res = result.data
        	if (res.status === '0') {
        		console.log(res.msg);
        	} else{
            this.mdShow = true;
        		console.log(res.msg);
        	}
        })
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 1000);
      },
      closeModal () {
        this.mdShow = false
      }
    }
  }
</script>

<style>

</style>