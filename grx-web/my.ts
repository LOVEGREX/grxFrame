import { createServer, IncomingMessage, ServerResponse } from "http";
import { Url, URL } from "url";

//定义路由存储结构
interface Router {
    method: string;
    url: string;
    handler: (ctx: Ctx) => void;
}    

//存储所有注册的路由
// const routers: Router[] = [];
//更新map键值对 存储所有的路由
const routers: Map<string, Map<string, (ctx: Ctx) => void>> = new Map();

//ctx是context的缩写 上下文接口
interface Ctx {

  req: IncomingMessage;
  res: ServerResponse;

  /**
   * @description 返回json数据
   */
  json:(input: object) => void;

  //中间件数据
  middlewaredData: Map<string,any>;
  //获取中间件数据
  getMiddlewareData: (key: string) => {};
  //设置中间件数据
  setMiddlewareData: (key: string, value: any) => void;
}

//回调函数 callback定义 路由处理
type Cb = (ctx: Ctx) => void;

//中间件的定义
type Middleware = (ctx: Ctx, next: () => Promise<void>, pre: Map<string,any>) => Promise<void>;

//中间件存储结构
const middlewares: Middleware[] = [];

//中间件next函数
export async function next(ctx: Ctx,index: number = 0, middlewaredData: Map<string,any> = new Map) { 
    //中间件处理
    if (index >= middlewares.length) { 
        return;
    } 
    await middlewares[index](ctx, async () => { 
        //中间件处理完成 返回信息
        const middlewaredData = ctx.middlewaredData;
        console.log(middlewaredData);
        //递归调用
        await next(ctx, index + 1, middlewaredData);
    },ctx.middlewaredData);
}

//创建http服务器
export const server = createServer( async (req, res) => { 
    //创建上下文对象 ctx
    const ctx: Ctx = { 
        req, 
        res 
        , json: (input: object) => { 
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(input));
        },
        middlewaredData: new Map<string, any>(),
        getMiddlewareData(key: string){ 
            return this.middlewaredData.get(key);
        },
        setMiddlewareData(key: string, value: any){ 
            this.middlewaredData.set(key, value);
        }
    };
    //中间件处理
    await next(ctx);
    try { 
        //处理中间件
        await next(ctx);
        
        //url 解析对象
        const url = new URL(req.url || '/', 'http://$(req.headers.host)');
        url.pathname = normalized(url.pathname);
    
        //处理路由
        console.log('处理准备开始');
        await handler(ctx, req, res, url);
        console.log('处理完成');

    } catch (error) { 
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.log(error);
    }

});

async function handler(ctx : Ctx , req: IncomingMessage, res: ServerResponse , url: URL){
    //老方法遍历所有注册的路由，每次都需要完整遍历
    // for (const router of routers) { 
    //     //判断当前请求的路径和注册的路径是否匹配
    //     //标准化路径
    //     url.pathname = normalized(url.pathname);
    //     if (router.method === req.method && url.pathname === router.url) { 
    //         //执行处理函数
    //         //trycatch
    //         try { 
    //             await router.handler(ctx);
    //         } catch (error) { 
    //             res.statusCode = 500;
    //             res.end('Internal Server Error');
    //             console.log(error);
    //         }
    //         return;
    //     }
    //     else { 
    //         continue;
    //     }
    // }

    //新方法:mAp 存储所有路由
    //提取选择的方法 首先保证方法存在 换为URL后没这个问题了
    // if (!url.pathname) {
    //     res.statusCode = 400;
    //     res.end('Bad Request');
    //     return;
    // }
    if(req.method){
        const map = routers.get(req.method);
        //标准化
        //如果没有找到 即url不匹配
        if(!map){
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        //查找对应的处理函数
        const handler = map.get(url.pathname);
        //如果没有找到
        if(!handler){
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        //执行处理函数
        try{
            await handler(ctx);
        } catch (error) { 
            res.statusCode = 500;
            res.end('Internal Server Error');
            console.log(error);
        }
    }
}

function normalized(url: string) { 

    let pathname = url;
    //如果路径开头没有/
    if (!pathname.startsWith('/')) { 
        pathname = '/'+ pathname;
    }
    //如果有参数
    const queryIndex = pathname.indexOf('?');
    if (queryIndex != -1){
        pathname = pathname.substring(0, queryIndex);
    }
    //如果路径结尾没有/
    if (!pathname.endsWith('/')) { 
        pathname = pathname + '/';
    }

    return pathname;
}

//router对象
export const router = {

    //注册中间件
    use: (middleware: Middleware) => { 
        middlewares.push(middleware);
    },
    //注册get路由 url表示要匹配的url路径 cb表示处理函数
    get:(url: string, cb: Cb) => { 
        //获取标准化的路径
        url = normalized(url);
        //routers.push({method:'GET', url, handler:cb});
        //get方法并不需要返回值
        // return {method:'GET',url, handler:cb};
        const method = 'GET';
        const map = routers.get(method) || new Map();
        map.set(url, cb);
        routers.set(method, map);
    },
    post:(url: string, cb: Cb) => { 
        //获取标准化的路径
        url = normalized(url);
        //routers.push({method:'POST',url, handler:cb});
        const method = 'POST';
        const map = routers.get(method) || new Map();
        map.set(url, cb);
        routers.set(method, map);
        return {method:'POST',url, handler:cb};
    }
}