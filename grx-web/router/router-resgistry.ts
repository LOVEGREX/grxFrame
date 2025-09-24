// router/router-registry.ts
// 存储路由的 Map 结构和相关操作
import { Ctx } from '../types';
const routers: Map<string, Map<string, (ctx: Ctx) => void>> = new Map();

// 路由注册函数
export function registerRoute(method: string, url: string, handler: (ctx: Ctx) => void) {
    const map = routers.get(method) || new Map();
    map.set(url, handler);
    routers.set(method, map);
}

export function getRouteHandler(method: string, url: string) {
    const map = routers.get(method);
    if (!map) return null;
    return map.get(url);
}