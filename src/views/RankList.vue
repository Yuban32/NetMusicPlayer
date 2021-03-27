<template>
    <div class="rank-list">
        <div class="rank-wrap" v-if="!playViewShow">
            <div class="netease-rank">
                <rank-list-title :title="'网易云音乐榜'"></rank-list-title>
                <div class="card-wrap">
                    <card-img v-for=" item  in neteaseSpecialRankList" :key="item.id"
                        :background="item.coverImgUrl+'?param=200y200'" :title="item.name"
                        :hot="playCountFormat(item.playCount)" @click.native="showRankListDetail(item)"></card-img>
                </div>
            </div>
            <div class="global-rank">
                <rank-list-title :title="'全球榜'"></rank-list-title>
                <div class="card-wrap">
                    <card-img v-for="item in globalRankList" :key="item.id" :background="item.coverImgUrl"
                        :title="item.name" :hot="playCountFormat(item.playCount)"
                        @click.native="showRankListDetail(item)"></card-img>
                </div>
            </div>
        </div>
        <div class="showDetail">
            {{albumShow?'':noData}}
            <albumDetail v-if="albumShow" :albumDetailData="albumDetailData" :albumList="albumList"
                :backForwardShow="playViewShow" @showAlbum="playShowHandle"></albumDetail>
        </div>
    </div>
</template>
<script>
    import cardImg from '@/components/Card-img'
    import RankListTitle from '../components/Rank-list-title.vue';
    import AlbumDetail from '@/components/AlbumDetail'
    import {
        mapState
    } from 'vuex';
    export default {
        data() {
            return {
                neteaseSpecialRankList: [],
                globalRankList: [],
                albumDetailData: [],
                albumList: [],
                albumShow: false,
                noData: '正在努力加载歌单信息~',
                backForwardShow: false
            }
        },
        methods: {
            playShowHandle() {
                this.$store.commit('setPlayViewShow', false);
            },
            showRankListDetail(item) {
                let id = null;
                if (!item) {
                    id = 19723756;
                } else {
                    id = item.id
                }
                // console.log(item);
                this.axios.get("/playlist/detail/dynamic?id=" + id).then(re => {
                    let data = re.data.playlist
                    this.albumDetailData = [];
                    this.albumDetailData.push({
                        coverImgUrl: data.coverImgUrl,
                        albumName: data.name,
                        description: data.description,
                        creatorName: data.creator.nickname
                    });
                    // console.log(data.tracks);
                    this.albumList = [];
                    data.tracks.forEach(item => {
                        // console.log(item.id,item.name,item.ar[0].name,item.ar[0].id,item.al.name,item.al.id,item.dt,item.al.picUrl,);
                        this.albumList.push({
                            musicID: item.id,
                            musicName: item.name,
                            artist: item.ar[0].name,
                            artistID: item.ar[0].id,
                            album: item.al.name,
                            albumID: item.al.id,
                            duration: item.dt,
                            picUrl: item.al.picUrl,
                        })
                    })
                    this.albumShow = true;
                })

            },
            playCountFormat(num) {
                let playCount = Number(num);
                if (playCount == 0) {
                    return playCount + ``;
                } else if (playCount > 11 && playCount < 10000) {
                    return playCount + '';
                } else {
                    return (playCount / 10000).toFixed(2) + '万'
                }
            }
        },
        components: {
            'card-img': cardImg,
            'albumDetail': AlbumDetail,
            'rankListTitle': RankListTitle
        },
        mounted() {
            // 初始化榜单数据
            this.axios.get('/toplist').then(re => {
                let data = re.data.list
                // console.log(data);
                data.forEach((item, index) => {
                    if (index == 0 || index == 1 || index == 2 || index == 3) {
                        this.neteaseSpecialRankList.push(item)
                    } else {
                        this.globalRankList.push(item)
                    }
                });
            });
            this.showRankListDetail();

        },
        computed: {
            // 动态获取vuex里的指定数据
            ...mapState({
                playViewShow: state => state.playViewShow
            }),
        },
        watch: {
            playViewShow(val, old) {
                this.backForwardShow = val;
                return val
            }
        }
    }
</script>
<style scoped>
    .rank-list {
        overflow: hidden;
        display: flex;
        position: relative;
    }

    .card-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding-top: 20px;
    }

    /* /deep/是样式穿透的语法 也可以用>>> */
    .card-img-wrap /deep/ .card-img-bg {
        opacity: 0.7;
    }

    .card-img-wrap {
        margin: 15px;
    }

    .rank-wrap {
        flex: 1;
        overflow-y: auto;
    }

    /* 详细歌单 */
    .showDetail {
        flex: 1;
        width: 50%;
        height: calc(100vh - 90px);
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(0, 0, 0, 0.3);
        overflow-x: hidden;
        content-visibility: auto;
        position: relative;
    }

    .netease-rank,
    .global-rank {
        padding-top: 50px;
    }

    .albumDetail /deep/ .backForwardWrap {
        bottom: 0px;
        right: -35px;
    }

    .albumDetail /deep/ .backForwardWrap:hover {
        right: 65px;
    }
</style>