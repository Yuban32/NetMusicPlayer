class Util {
    mediaMetaDataHandle(musicInfo) {
        // console.log(musicInfo);
        musicInfo = musicInfo[0];
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({ // eslint-disable-line no-undef
                title: musicInfo.musicName,
                artist: musicInfo.artist,
                album: musicInfo.album,
                artwork: [{
                        src: `${musicInfo.picUrl}?param=192y192`,
                        sizes: `192x192`,
                        type: `image/png`
                    }

                ]
            });
            // navigator.mediaSession.setActionHandler('previoustrack',()=>{})
        }
    }
    zeroFill(num) {
        return num < 10 ? '0' + num : num;
    }
    playTimeFormat(time) {
        // console.log(time);
        // 时间格式化
        // let hour = this.zeroFill(Math.floor(time / 3600));
        let minutes = Math.floor(time % 3600 / 60);
        let seconds = this.zeroFill(Math.floor(time % 60));
        return `${minutes} : ${seconds}`

    }
    unique(arr) {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr.musicID) && res.set(arr.musicID, 1))
    }

}

export default new Util()