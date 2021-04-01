import Vue from 'vue'
import Vuex from 'vuex'
import util from '@/util/util'
Vue.use(Vuex)
let tempArr = [];
export default new Vuex.Store({

    state: {
        musicInfo: {
            musicID: 1833633769,
            musicName: '暂无歌曲',
            artist: '暂无',
            artistID: 0,
            album: '暂无',
            albumID: '',
            picUrl: '',
            musicUrl: 1833633769,
            duration: 0,
            totalTime: 0
        },
        musicList: [],
        isPlay: false,
        recommAlbumList: [],
        audioElement: null,
        playViewShow: false,
        showPlayList: false,
        loginCookie: null,
        loginStatus: false,
        userInfo: [],
        userID: null,
        LOADING: true,
        musicVisualization:null,
        playModes:null
    },
    mutations: {
        getUserInfo(state, info) {
            state.userInfo = info
        },
        setLoginCookie(state, cookie) {
            state.loginCookie = cookie;
            document.cookie = cookie
        },
        setLoginStatus(state, status) {
            state.loginStatus = status;
            sessionStorage.setItem('loginStatus', status)

        },
        getMusicInfo(state, MusicInfo) {
            console.log(MusicInfo);
            tempArr.push(MusicInfo[0])
            state.musicList = util.unique(tempArr);
            state.musicInfo.musicID = MusicInfo[0].musicID;
            state.musicInfo.musicName = MusicInfo[0].musicName;
            state.musicInfo.artist = MusicInfo[0].artist;
            state.musicInfo.artistID = MusicInfo[0].artistID;
            state.musicInfo.album = MusicInfo[0].album;
            state.musicInfo.albumID = MusicInfo[0].albumID;
            state.musicInfo.musicUrl = MusicInfo[0].musicID;
            state.musicInfo.picUrl = MusicInfo[0].picUrl;
            state.musicInfo.duration = MusicInfo[0].duration;
            state.musicInfo.totalTime = MusicInfo[0].totalTime;
            document.title = MusicInfo[0].musicName +' - ' +MusicInfo[0].album;
        },
        addMusicList(state, list) {
            // let e = util.unique(list)
            // state.musicList.push(...e)
            // console.log(state.musicList);
        },
        getPicURL(state, step) {
            state.musicInfo.picUrl = step;
        },
        getMusicList(state, step) {
            state.musicList = step;
        },
        isPlay(state, step) {
            state.isPlay = step;
        },
        getRecommAlbum(state, step) {
            state.recommAlbumList = step;
        },
        getAudioElement(state, element) {
            state.audioElement = element;
            // console.log(element);
        },
        setPlayViewShow(state, stpe) {
            state.playViewShow = stpe;
            // console.log(stpe);
        },
        setShowPlayList(state, step) {
            state.showPlayList = step;
        },
        setUserID(state, userID) {
            state.userID = userID;
            localStorage.setItem('userID', userID);
        },
        SET_LOADING(state, loading) {
            state.LOADING = loading;
        },
        CLEAN_LOADING(state) {
            state.LOADING = false;
        },setMusicVisualization(state,flag){
            state.musicVisualization = flag;
            // console.log(state.musicVisualization);
        },
        setPlayMode(state,flag){
            state.playModes = flag;
            sessionStorage.setItem('NetMusicPlayer_PlayMode',flag)

        }
    },
    getters: {
        getLoginCookie: state => {
            let cookies = state.loginCookie ? state.loginCookie : document.cookie;
            return cookies;
        },
        getLoginStatus: state => {
            let status = state.loginStatus ? state.loginStatus : sessionStorage.getItem('loginStatus');
            status = encodeURI(status)
            
            return status;
        },
        getPlayMode:state=>{
            let mode = state.playModes?state.playModes:sessionStorage.getItem('NetMusicPlayer_PlayMode');
            return mode;
        }
    },
    actions: {
        SetLoding({
            commit
        }, boolean) {
            commit('SET_LOADING', boolean)
        },
        CLEANLOADING({
            commit
        }) {
            commit('CLEAN_LOADING')
        }
    }
})