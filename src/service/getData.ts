import fetch from '../config/fetch';
import { RECOMMEND_URL } from '../config/api';

// 获取推荐

export const recommendList = () => fetch(RECOMMEND_URL);
