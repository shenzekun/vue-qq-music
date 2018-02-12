import fetch from '../config/fetch';
import { RECOMMEND_URL, TOPLIST_URL } from '../config/api';

// 获取推荐
export const recommendList = () => fetch(RECOMMEND_URL);

// 获取排行榜
export const rankList = () => fetch(TOPLIST_URL);
