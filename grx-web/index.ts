import {router,server} from "./my";

exports.router = router;

// 在文件末尾添加以下代码
export function run(port: number = 3000) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}