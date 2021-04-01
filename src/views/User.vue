<template>
    <div class="user-wrap">
        <toast ref="toast"></toast>
        <loading v-if="noData"></loading>
        <div class="user-info-wrap" v-if="!playViewShow">
            <div class="user-info">
                <div class="user-img"><img :src="userProfile.avatarUrl" alt="头像"></div>
                <div class="user-info-panel-wrap">
                    <div class="user-panel">
                        <span class="name">{{userProfile.nickname}}</span>
                        <span class="level"> Lv.{{userLevel}}</span>
                        <span class="logout" @click="logout">退出</span>
                        <!-- <span class="membership">{{userVipType=10?'音乐包':userVipType}}</span> -->
                    </div>
                    <div class="user-info-detail">
                        <div class="follows-wrap">
                        <span class="palyCount"> 累计听歌{{userListenSongs}}首</span>
                            <ul>
                                <li>动态{{userProfile.eventCount}}</li>
                                <li>关注{{userProfile.follows}}</li>
                                <li>粉丝{{userProfile.followeds}}</li>
                            </ul>
                        </div>
                        <div class="address">
                            <span class="province">所在地区:{{province}} {{city}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="collection-wrap">
                <rank-list-title :title="'我的歌单'" :fontSize="22" :textAlign="'left'"></rank-list-title>
                <div class="collection">
                    {{noData?'正在努力加载信息中~':''}}
                    <card-img class="card-imgs" v-for="item in collectionPlayList" :key="item.id"
                    :background="item.coverImgUrl+'?param=200y200'" :title="item.name" :hot="item.playCount"
                    @click.native="showMyCollection(item)"
                    ></card-img>
                </div>
            </div>
        </div>
        <div class="show-album-detail">
            <albumDetail v-if="albumShow"
            :albumDetailData="albumDescription"
            :albumList="albumList"
            @showAlbum="playShowHandler"
            :backForwardShow="playViewShow"
            @scroll="handeleScroll(e)"
            :showMore="true"
            @showMoreHandler="showMoreHandler"
            ></albumDetail>
            
        </div>
    </div>
</template>
<script>
import Toast from '@/components/Toast'
import { mapState } from 'vuex'
import areaCode from '@/util/areaCode'
import CardImg from '@/components/Card-img'
import RankListTitle from '@/components/Rank-list-title'
import AlbumDetail from '../components/AlbumDetail.vue'
import Loading from '@/components/Loading'
export default {
    data(){
        return{
            userProfile:[],
            userLevel:0,
            userVipType:'',
            userListenSongs:0,
            userCreateDays:0,
            province:'',
            city:'',
            userID:null,
            loginStatus:false,
            loginCookie:null,
            collectionPlayList:[],
            albumDescription:[],
            albumList:[],
            albumShow:false,
            offset:1,
            musicID:null,
            musicIDs:null,
            dataList:[],
            showLoading:true,
            noData:true,
        }
    },methods:{
        showMoreHandler(e){
            this.offset = e;
            this.searchAlbumList()
        },
        logout(){
            let exp = new Date()
            let timer = null
            this.axios.get('/logout').then(re=>{
                this.$refs.toast.showToast('已经退出登录,3秒后跳转到登录页面',3);
                document.cookie = "MUSIC_U=;domain=localhost;expires="+exp.toGMTString()+";path=/";
                document.cookie = "__csrf=;domain=localhost;expires="+exp.toGMTString()+";path=/";
                document.cookie = "NMTID=;domain=localhost;expires="+exp.toGMTString()+";path=/";
                timer = setTimeout(()=>{
                    window.location.reload()
                },3000);
                clearTimeout(timer)
            })
            // let ac = encodeURIComponent(this.loginCookie)
            // console.log(ac);
            // this.axios.get(`/login/refresh`,{
            //     withCreDentials:true
            // }).then(res=>{
            //     console.log(res);
            // }).catch(er=>{
            //     console.dir(er);
            // })
        },
        playShowHandler() {
            this.$store.commit('setPlayViewShow', false);
        },
        showMyCollection(item){
            this.noData=true;
            // 给一个默认显示的歌单
            let id = item?item.id:313718455;
            // console.log(id);
            this.musicID = [];
            this.albumList = [];
            this.axios.get(`/playlist/detail?id=${id}`).then(re=>{
                this.$store.dispatch('SetLoding', true);
                let data = re.data.playlist;
                this.albumDescription = [];
                this.albumDescription.push({
                    coverImgUrl: data.coverImgUrl,
                    albumName: data.name,
                    description: '歌单创建者太懒了,没留下任何介绍~ ',
                    creatorName: data.creator.nickname
                });
                this.musicID=data.trackIds.map((item,index) => {
                    return item.id
                    })
                this.searchAlbumList(data)
                this.albumShow = true;
            })
            
        },
        searchAlbumList(data){
                this.musicIDs = []
                this.musicID.forEach((item,index)=>{
                    if(index<100*this.offset){
                        this.musicIDs.push(item)
                    }
                })

                this.axios.get(`/song/detail?ids=${this.musicIDs}`).then(res=>{
                            // console.log('测试=>',res);
                            let songs = res.data.songs
                            songs.forEach(item=>{
                                this.albumList.push({
                                musicID:item.id,
                                musicName:item.name,
                                artist:item.ar[0].name,
                                artistID:item.ar[0].id,
                                artist2:item.ar[1]?item.ar[1].name:'',
                                artistID2:item.ar[1]?item.ar[1].id:'',
                                album:item.al.name,
                                albumID:item.al.id,
                                duration:item.dt,
                                picUrl:item.al.picUrl
                            });
                            this.$store.dispatch('SetLoding', false);
                            this.noData =false
                        })
                    })
        },
        beforeunloadHandler(e){
            this.getUserInfo()
        },getUserInfo(){
            // let loginStatus = this.$store.state.loginStatus?this.$store.state.loginStatus:sessionStorage.getItem('loginStatus');
            this.loginStatus = this.$store.getters.getLoginStatus;
            this.loginCookie = this.$store.getters.getLoginCookie
            this.userID = this.$store.state.userInfo.userId?this.$store.state.userInfo.userId:localStorage.getItem('userID');
            if(this.loginCookie){
                this.axios.get(`/user/detail?uid=${this.userID}?cookie=${this.loginCookie}`).then(result=>{
                    // console.log(result);
                    let data = result.data
                    this.userLevel = data.level;
                    this.userVipType = data.profile.vipType;
                    this.userListenSongs = data.listenSongs;
                    this.userCreateDays = data.createDays;
                    this.userProfile = data.profile;
                    let areaCodes = Array.from(areaCode);
                    areaCodes.forEach((item,index)=>{
                        if(item.code==this.userProfile.province){
                            let provinceAreaList = Array.from(item.areaList)
                            this.province = item.name
                            provinceAreaList.forEach(items=>{
                                if(items.code==450100){
                                    this.city = items.name
                                }

                            })
                        }
                    })
                })
            }
        },getUserPlayList(){
            this.axios.get(`/user/playlist?uid=${this.userID}`).then(result=>{
                // console.log(result);
                this.collectionPlayList = result.data.playlist
            }).catch(error=>{
                console.log(error);
            })
        }

    },
    components:{
        'toast':Toast,
        ...mapState(['loginStatus']),
        'rank-list-title':RankListTitle,
        'albumDetail':AlbumDetail,
        'card-img':CardImg,
        'loading':Loading
    },
    computed:{
        ...mapState({
                playViewShow: state => state.playViewShow,
                loadingStatus:state=>state.LOADING
            }),
    },
    watch: {
        playViewShow(val, old) {
            this.backForwardShow = val;
            return val
        },
        loadingStatus(val,old){
            return val;
        }
    },
    mounted(){
        window.addEventListener('beforeunload',e=>{
            this.beforeunloadHandler(e)
        })
        // this.axios.get('/login/status'+document.cookie).then(res=>{
        //     console.log(res);
        // }).catch(error=>{
        //     console.log(error);
        // })
        this.getUserInfo()
        this.getUserPlayList()
        this.showMyCollection()
        let timer = null
        clearTimeout(timer)
        timer = setTimeout(()=>{
            this.showLoading = false;
        },1000)
    }

}
</script>

<style scoped>
    .collection-wrap{ 
        
        padding: 20px;
    }
    .collection{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin: 0 auto;
    }
    .collection .card-imgs{
        margin: 10px 10px 20px 10px;
        /* height: 220px !important; */
    }
    .card-imgs /deep/ .card-name{
        /* border: 1px solid red; */
        height: 20px;
        overflow: hidden;
    }
    .collection /deep/ .card-img-bg {
        opacity: 0.7;
    }

    /* 歌单详情列表部分 */
    /* 子组件宽度兼容问题 暂未找到原因 只能强制设定50%宽度 */
  .albumDetail /deep/{
    height: calc(100% - 90px);
    width: 50% !important;
  }
  .albumDetail /deep/ .backForwardWrap {
    padding-left:10px;
    right: -118px;
    bottom: 100px;
  }
  .albumDetail /deep/ .backForwardWrap:hover{
    right: 0px;
  }
    .user-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        
    }
    .user-wrap .show-album-detail{
        border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
    .user-wrap .user-info-wrap, .user-wrap .show-album-detail{
        flex: 1;
        width: 50%;
        height: 100%;
        
        overflow: hidden;
    }
    .user-wrap .user-info-wrap{
        /* background-color: rgba(0, 0, 0, 0.404); */
        flex: 1;
        overflow: hidden auto;
    }
    .user-wrap .user-info-wrap .user-info{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.404);

        border: 1px solid black;
    }
    .user-wrap .user-info-wrap .user-info .user-img{
        width: 150px;
        height: 150px;
        border-radius: 15px;
        overflow: hidden;
    }
    .user-wrap .user-info-wrap .user-info .user-img img{
        width: 150px;
        height: 150px;

    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap{
        width: calc(100% - 150px);
        height: 100%;
        text-align: left;
        padding: 10px 0 0 20px;
        box-sizing: border-box;
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-panel{
        padding-bottom: 5px;
        border-bottom: 1px solid rgb(255, 0, 0);
        
    }
    .level{
        font-style: italic;
    }
    .palyCount{
        /* font-size: 14px !important; */
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-panel .logout{
        user-select: none;
        font-size: 16px;
        padding: 2px;
        border-radius: 5px;
        float: right;
        cursor: pointer;
        border: 1px solid rgb(255, 255, 255);
        background-color: rgba(0, 0, 0, 0.555);
        transition: color 0.2s;
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-panel .logout:hover{
        color: #fff;
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-panel span{
        font-size: 22px;
        overflow: hidden;
        word-wrap: break-word;
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-info-detail ul{
        display: flex;
        flex-direction: row;
        height: 30px;
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-info-detail ul li{
        font-size: 16px;
        line-height:30px;
        margin-right: 10px;
    }
    .user-wrap .user-info-wrap .user-info .user-info-panel-wrap .user-info-detail{
        display: flex;
        height: 70%;
        flex-direction: column;
        justify-content: center;
    }
</style>