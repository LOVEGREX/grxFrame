grx-web 框架使用指南

简介

grx-web 是一个轻量级、高性能的 Node.js Web 框架，提供简洁的路由定义和请求处理功能。

安装

npm install grx-web


基本用法

1. 导入框架

const { router, run } = require('grx-web');


2. 定义路由

grx-web 支持多种 HTTP 方法的路由定义：

GET 请求

// 基本 GET 请求
router.get('/', (ctx) => {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html' });
    ctx.res.end('<h1>Hello World!</h1>');
});

// 返回 JSON 数据
router.get('/api/users', (ctx) => {
    ctx.json({
        users: [
            { id: 1, name: '张三' },
            { id: 2, name: '李四' }
        ]
    });
});


POST 请求

router.post('/api/users', (ctx) => {
    ctx.res.writeHead(201, { 'Content-Type': 'application/json' });
    ctx.res.end(JSON.stringify({ message: 'User created successfully' }));
});


3. 启动服务器

// 在指定端口启动服务器
run(3000);


上下文对象 (ctx)

grx-web 为每个请求提供一个上下文对象，包含以下属性：

• ctx.req: HTTP 请求对象

• ctx.res: HTTP 响应对象

• ctx.json(data): 便捷方法，用于返回 JSON 响应

完整示例

const { router, run } = require('grx-web');

// 注册一个GET路由
router.get('/', (ctx) => {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html' });
    ctx.res.end('<h1>Hello World!</h1>');
});

// 注册一个返回JSON的GET路由
router.get('/api/users', (ctx) => {
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

// 启动服务器
run(3000);

4. 中间件支持
参考example文件中src目录下index.ts文件运行
//导入use
import { use } from 'grx-web-demo';
//注册一个wrap中间件
use(async (ctx, next) => {
    ctx.setMiddlewareData('key3', 3);
    console.log('wrap1开始');
    await next();
    console.log('wrap1结束');
    
});

//注册一个pipe中间件
use(async (ctx, next) => {
    ctx.setMiddlewareData('key1', 1);
    console.log('流水1开始');
    console.log('流水1结束');
    await next();
    
});

进阶功能

grx-web 还支持以下功能：

• 路由参数解析

• 中间件支持

请参考完整文档获取更多信息。

许可证

MIT License