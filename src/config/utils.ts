import { LYRICS_URL, SEARCH_URL } from './api';

// 歌url
export function songUrl(id: number) {
    // return `http://ws.stream.qqmusic.qq.com/${id}.m4a?fromtag=46`;
    return `http://isure.stream.qqmusic.qq.com/C100${id}.m4a?fromtag=32`;
}

// 歌词 url
export function lyricsUrl(songid: number) {
    return `${LYRICS_URL}?id=${songid}`;
}

// 相册
export function albumCoverUrl(id: number) {
    return `https://y.gtimg.cn/music/photo_new/T002R150x150M000${id}.jpg`;
}

// 处理搜索的 url
// @param {any} keyword 用户输入的数据
// @param {number} [page=1]  页数默认为1
export function searchUrl(keyword, page = 1) {
    return `${SEARCH_URL}?keyword=${keyword}&page=${page}`;
}
