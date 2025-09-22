import { createServer, IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

//定义路由存储结构
interface Router {
    method: string;
    url: string;
    handler: (ctx: Ctx) => void;
}    

//存储所有注册的路由
const routers: Router[] = [];

//ctx是context的缩写 上下文接口
interface Ctx {
  req: IncomingMessage;
  res: ServerResponse;
  /**
   * @description 返回json数据
   */
  json:(input: object) => void;
}

//回调函数 callback定义 路由处理
type Cb = (ctx: Ctx) => void;

//创建http服务器
export const server = createServer( async (req, res) => { 
    //创建上下文对象 ctx
    const ctx: Ctx = { 
        req, 
        res 
        , json: (input: object) => { 
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(input));
        }
    };
    //url 解析对象
    const url = new URL(req.url || '/', 'http://$(req.headers.host)');

    for (const router of routers) { 
        //判断当前请求的路径和注册的路径是否匹配
        if (router.method === req.method && url.pathname === router.url) { 
            //执行处理函数
            router.handler(ctx);
            return;
        }
        else { 
            continue;
        }
    }

    res.statusCode = 404;
    res.end('Not Found');
});


//router对象
export const router = {
    //注册get路由 url表示要匹配的url路径 cb表示处理函数
    get:(url: string, cb: Cb) => { 
        routers.push({method:'GET',url, handler:cb});
        return {method:'GET',url, handler:cb};
    },
    post:(url: string, cb: Cb) => { 
        routers.push({method:'POST',url, handler:cb});
        return {method:'POST',url, handler:cb};
    }
}