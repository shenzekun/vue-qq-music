import fetch from '../config/fetch';
import { RECOMMEND_URL, TOPLIST_URL, HOTKEYS_URL } from '../config/api';
import { searchUrl } from '../config/utils';

// 获取推荐
export const recommendList = () => fetch(RECOMMEND_URL);

// 获取排行榜
export const rankList = () => fetch(TOPLIST_URL);

// 获取热门搜索关键词
export const hotList = () => fetch(HOTKEYS_URL);

// 获取搜索内容
export const searchList = (keyword, page?: number) => fetch(searchUrl(keyword, page));
