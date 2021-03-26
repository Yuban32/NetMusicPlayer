import Vue from 'vue'
import Vuex from 'vuex'
import util from '@/util/util'
Vue.use(Vuex)
let tempArr = [];
export default new Vuex.Store({

    state: {
        musicInfo: {
            musicID: 0,
            musicName: '暂无歌曲',
            artist: '暂无',
            artistID: 0,
            album: '暂无',
            albumID: 0,
            picUrl: 0,
            musicUrl: 0,
            duration: 0,
            totalTime: 0
        },
        musicList: [],
        isPlay: false,
        recommAlbumList: [],
        audioElement: null,
        playViewShow: false,
    },
    mutations: {

        getMusicInfo(state, MusicInfo) {
            tempArr.push(MusicInfo[0])
            state.musicList = util.unique(tempArr);

            // console.log(state.musicList);
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
        }
    },
})