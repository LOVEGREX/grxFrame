import {router,server} from "./export";
import { use , usePipe } from "./middleware/middleware-chain";
export {
  router,use,usePipe
}
export function run(port: number = 3000) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}
