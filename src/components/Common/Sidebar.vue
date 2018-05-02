<template>
    <div :class="{'sidebar-hide-text': sidebarSpan < 3}">
        <div class="sidebar-title">
            <img v-show="sidebarSpan < 3" class="sidebar-logo" :src="logo"/>
            <span v-show="sidebarSpan === 3" class="sidebar-title-text">华建项目申报管理后台</span>
        </div>
        <ul class="m-menu-list">
            <li v-for="(menu, i) in MenuList" :key="i" :class="['menu-item', menu.submenu.length > 0 ? 'menu-submenu' : '', activeName == menu.name ? 'menu-active' : '']">
                <!-- 一级菜单列表-无二级菜单 -->
                <div v-if="menu.submenu.length <= 0" class="menu-title" @click="selectMenu(i)">
                    <router-link :to="{ name: menu.name }" >
                        <Icon class="menu-title-icon" :type="menu.icon"></Icon>
                        {{ menu.text }}
                    </router-link>
                </div>
                <!-- 一级菜单列表-含二级菜单 -->
                <div v-else class="menu-submenu-title" @click="selectMenu(i)">
                    <Icon class="menu-title-icon" :type="menu.icon"></Icon>
                    {{ menu.text }}
                    <Icon class="menu-submenu-title-icon" v-if="menu.submenu.length > 0" type="ios-arrow-down"></Icon>
                </div>
                <!-- 二级子菜单列表 -->
                <ul v-if="menu.submenu.length > 0" class="m-submenu-list">
                    <li v-for="(item, index) in menu.submenu" :key="index" class="submenu-item">
                        <div class="submenu-title" @click="selectSubmenu(i, index)">
                            <router-link :to="{ name: item.name }" >{{ item.text }}</router-link>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
  import $ from 'jquery'
  // Vuex
  import { mapGetters } from 'vuex'

  export default {
      computed: {
          ...mapGetters([ 'sidebarSpan', 'contentSpan' ]),
          iconSize () {
              return this.sidebarSpan === 3 ? 14 : 24;
          }
      },
      data () {
          return {
              nowActive: '',
              // LOGO
              logo: require('assets/images/icon-logo.png'),
              // 第一次加载激活的一级菜单对应路由name
              activeName: 'Home',
              // 菜单列表
              MenuList: [
                  {
                      name: 'Home',
                      icon: 'home',
                      text: '首页',
                      submenu: []
                  },
                  {
                      name: 'AccountManage',
                      icon: 'person',
                      text: '账户管理',
                      submenu: []
                  },
                  {
                      name: 'ArticleManage',
                      icon: 'document-text',
                      text: '文章管理',
                      submenu: []
                  },
//                  {
//                      name: 'CaseManage',
//                      icon: 'cube',
//                      text: '案例管理',
//                      submenu: []
//                  },
  //                {
  //                    name: 'Broadcast',
  //                    icon: 'android-volume-up',
  //                    text: '广播管理',
  //                    submenu: []
  //                },
  //                {
  //                    name: 'DeclareMsg',
  //                    icon: 'android-mail',
  //                    text: '申报消息',
  //                    submenu: []
  //                },
//                  {
//                      name: 'ContactManage',
//                      icon: 'ios-telephone',
//                      text: '联系设置',
//                      submenu: [
//                          {
//                              name: 'CompanyInfo',
//                              text: '公司介绍'
//                          },
//                          {
//                              name: 'ContactWay',
//                              text: '联系方式'
//                          },
//                      ]
//                  },
              ],
          }
      },
      mounted(){
          this.setSideBar();
      },
      methods:{
          // 设置侧边栏
          setSideBar(){
              let stop = false;
              let activeName = '';
              const menu = this.MenuList;
              // 遍历menu
              for(let i = 0 ; i < menu.length ; i ++){
                  if(!stop){
                      if(menu[i].submenu.length > 0){
                          // 遍历menu下的menu-item
                          for(let j = 0 ; j < menu[i].submenu.length; j ++){
                              // 获取二级菜单路由name
                              activeName = menu[i].submenu[j].name;
                              if(window.location.href.indexOf(activeName) != -1){
                                  this.nowActive = activeName;
                                  // 激活当前菜单
                                  this.setActive(i, j);
                                  stop = true;
                                  break;
                              }
                              else{
                                  this.nowActive = 'Home';
                                  // 激活当前菜单
                                  this.setActive(0, 0);
                              }
                          }
                      }
                      else{
                          // 获取一级菜单路由name
                          activeName = menu[i].name;
                          if(window.location.href.indexOf(activeName) != -1){
                              this.nowActive = activeName;
                              // 激活当前菜单
                              this.setActive(i, 0);
                              stop = true;
                          }
                          else{
                              this.nowActive = 'Home';
                              // 激活当前菜单
                              this.setActive(0, 0);
                          }
                      }
                  }
                  else break;
              }
          },
          // 激活当前菜单
          setActive(mIndex, subIndex){
              let item = $('.menu-item').eq(mIndex);
              this.activeMenu(item);

              let child = item.find('.m-submenu-list');
              if(child.length > 0){
                  let activeItem = child.find('.submenu-title').eq(subIndex);
                  if(activeItem.hasClass('submenu-active')) return;
                  child.css('display','block');
                  activeItem.addClass('submenu-active');
                  item.siblings().find('.m-submenu-list').css('display','none');
                  item.siblings().find('.submenu-title').removeClass('submenu-active');
              }
              else{
                  item.siblings().find('.m-submenu-list').css('display','none');
                  item.siblings().find('.submenu-title').removeClass('submenu-active');
              }
          },
          // 选中一级菜单
          selectMenu(index){
              let item = $('.menu-item').eq(index);
              let child = item.find('.m-submenu-list');
              // 判断是否有子菜单
              if(child.length > 0){
                  if(item.hasClass('menu-active')){
                      item.removeClass('menu-active');
                      child.slideUp(250);
                  }
                  else{
                      this.activeMenu(item);
                      child.slideDown(250);
                      this.removeActive(item.siblings());
                  }
              }
              else{
                  this.activeMenu(item);
                  this.removeActive(item.siblings());
              }
          },
          // 取消一级菜单的激活状态
          removeActive(item){
              item.find('.m-submenu-list').slideUp(250);
              item.find('.submenu-title').removeClass('submenu-active');
          },
          // 激活当前一级菜单
          activeMenu(item){
              item.siblings().removeClass('menu-active');
              item.addClass('menu-active');
          },
          // 激活二级菜单
          selectSubmenu(mIndex, subIndex){
              let parent = $('.menu-item').eq(mIndex);
              let item = parent.find('.submenu-title');
              item.removeClass('submenu-active').eq(subIndex).addClass('submenu-active');
              parent.siblings().find('.submenu-title').removeClass('submenu-active');
          }
      },
      watch:{
          '$route' (to, from) {
              // 对路由变化作出响应...
              this.setSideBar();
          }
      }
  }
</script>
<style lang="less" scoped>
    @import "../../assets/less/color";
    .sidebar-title{
        padding: 13px 0;
        color: #fff;
        text-align:center;
        border-bottom: 1px solid #3a3d44;
    }
    .sidebar-logo{
        display: block;
        margin: 0 auto;
    }
    .sidebar-hide-text{
        .menu-title a{
            padding: 10px 16px;
            text-align: center;
        }
        .menu-submenu-title{
            padding: 10px 16px 30px 16px;
            border-bottom: 1px solid #3a3d44;
        }

        .menu-title-icon{
            display: none;
        }

        .menu-submenu-title-icon{
            margin-right: 16px;
        }

        .submenu-title a{
            display: block;
            padding: 10px 16px;
            text-align: center;
            border-bottom: 1px solid #2f3135;
        }
    }

    .m-menu-list{
        width: 100%;
        font-size: 14px;
        position: relative;
        z-index: 900;
        margin: 0;
        padding: 0;
        outline: none;
        list-style: none;
        background: #4d5256;
        color:rgba(255, 255, 255, 0.7);
        a{
            color:rgba(255, 255, 255, 0.7);
        }
    }
    .menu-item, .menu-submenu{
        cursor: pointer;
        border-bottom: 1px solid #596065;
        &:last-child{
            border-bottom: none;
        }

        &:hover{
            background: #45484e;
            color: #fff;
        }
        i{
            margin-right: 8px;
        }
    }

    .xlmenu-item:hover .menu-title a{
        color: #fff;
    }

    .menu-title a{
        display: block;
        padding: 14px 24px;
    }
    .menu-active{
        &.menu-item{
            background: @base_color;
            .menu-title a{
                color: #fff;
            }
        }
        &.menu-submenu{
            color: #fff;
            border-right: none;
            background: #4d5256;

            &.submenu-active{
                color: #fff;
            }
            .menu-submenu-title-icon{
                transform: rotate(180deg);
            }
        }
    }
    .menu-submenu-title{
        display: block;
        padding: 14px 24px;
    }
    .menu-submenu-title-icon{
        float: right;
        margin-top: 4px;
        transition: transform 0.2s ease-in-out;
        -o-transition: transform 0.2s ease-in-out;
        -webkit-transition: transform 0.2s ease-in-out;
        -ms-transition: transform 0.2s ease-in-out;
        -moz-transition: transform 0.2s ease-in-out;
    }

    .m-submenu-list{
        background: #3a3d44;
        display: none;
    }
    .submenu-item{
        a:hover{
            color:#fff;
        }
    }
    .submenu-title{
        a{
            padding: 14px 0 14px 45px;
            display: block;
            &:hover{
                color: #fff;
            }
        }
        &.submenu-active{
            a{
                color: #fff;
                background: @base_color !important;
            }
        }
    }
</style>
