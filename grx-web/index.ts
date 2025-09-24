import {router,server} from "./export";
import { use } from "./middleware/middleware-chain";
export {
  router,use
}
export function run(port: number = 3000) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}
