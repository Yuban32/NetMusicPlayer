import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

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
            duration: 0
        },
        musicList: {

        },
        isPlay: false,
        recommAlbumList: [],
        audioElement: null,
    },
    mutations: {
        getMusicInfo(state, MusicInfo) {
            state.musicInfo.musicID = MusicInfo[0].musicID;
            state.musicInfo.musicName = MusicInfo[0].musicName;
            state.musicInfo.artist = MusicInfo[0].artist;
            state.musicInfo.artistID = MusicInfo[0].artistID;
            state.musicInfo.album = MusicInfo[0].album;
            state.musicInfo.albumID = MusicInfo[0].albumID;
            state.musicInfo.musicUrl = MusicInfo[0].musicID;
            state.musicInfo.picUrl = MusicInfo[0].picUrl;
            state.musicInfo.duration = MusicInfo[0].duration;
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
        }
    },
    actions: {

    }
})