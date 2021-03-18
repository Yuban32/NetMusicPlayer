class Util {
    mediaMetaDataHandle(musicInfo) {
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
        }
    }
    zeroFill(num) {
        return num < 10 ? '0' + num : num;
    }
    playTimeFormat(time) {
        // 时间格式化
        // let hour = this.zeroFill(Math.floor(time / 3600));
        let minutes = Math.floor(time % 3600 / 60);
        let seconds = this.zeroFill(Math.floor(time % 60));
        return `${minutes} : ${seconds}`

    }

}

export default new Util()