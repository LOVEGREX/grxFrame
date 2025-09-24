// router/router.ts
import { Ctx } from '../types';
import { normalized } from '../utils/url-normalizer';
import { registerRoute } from './router-resgistry';

type Cb = (ctx: Ctx) => void;

export const router = {
    get: (url: string, cb: Cb) => {
        url = normalized(url);
        registerRoute('GET', url, cb);
    },
    post: (url: string, cb: Cb) => {
        url = normalized(url);
        registerRoute('POST', url, cb);
    }
}