// app.js
//import { router, run, addMiddleware, addWrapMiddleware } from 'grx-web-demo';
import { router, run, use , usePipe } from 'C:/Users/v_gggoguo/Desktop/exe/grx-web-demo/grx-web';
// 注册一个GET路由
router.get('/', (ctx) => {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html' });
    ctx.res.end('<h1>Hello World!</h1>');
});

// 注册一个返回JSON的GET路由
router.get('/api/users?a=1', (ctx) => {
    ctx.json({
        users: [
            { id: 1, name: '张三' },
            { id: 2, name: '李四' }
        ]
    });
});

// 注册一个POST路由
router.post('/api/users', (ctx) => {
    ctx.res.writeHead(201, { 'Content-Type': 'application/json' });
    ctx.res.end(JSON.stringify({ message: 'User created successfully' }));
});

// 中间件测试
//流水中间件测试

//wrap中间件测试
use(async (ctx, next) => {
    ctx.setMiddlewareData('key3', 3);
    console.log('wrap1开始');
    await next();
    await next();
    console.log('wrap1结束');
    
});

// usePipe(async (ctx) => {
//     ctx.setMiddlewareData('key1', 1);
//     console.log('流水1开始');
//     console.log('流水1结束');
// });
// usePipe(async (ctx) => {
//     ctx.setMiddlewareData('key6', 1);
//     console.log('流水5开始');
//     console.log('流水5结束');
// });
// usePipe(async (ctx) => {
//     ctx.setMiddlewareData('key8', 1);
//     console.log('流水6开始');
//     console.log('流水6结束');
// });

// use(async (ctx, next) => {
//     ctx.setMiddlewareData('key4', 4);
//     console.log('wrap2开始');
//     await next();
//     console.log('wrap2结束');
// });



// usePipe(async (ctx, next) => {
//     ctx.setMiddlewareData('key2', 2);
//     console.log('流水2开始');
//     console.log('流水2结束');
// });




// addMiddleware((ctx)=>{
//     // ctx.getMiddlewareData;
//     console.log();
//     ctx.setMiddlewareData('key1', 1);
// } );

// // 
// addWrapMiddleware(( next )=>{
//     console.log('---->');
//     await next();
//     console.log('')
// });

// 启动服务器
run(3000);