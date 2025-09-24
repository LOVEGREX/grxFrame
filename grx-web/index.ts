import {router,server} from "./my";

export {
  router,
}

export function run(port: number = 3000) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}