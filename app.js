// app.js
const { router, run } = require('./dist/grx-web/index.js');

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