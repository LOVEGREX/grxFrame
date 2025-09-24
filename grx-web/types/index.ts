// types/index.ts
import { IncomingMessage, ServerResponse } from "http";

export interface Ctx {
    req: IncomingMessage;
    res: ServerResponse;
    json: (input: object) => void;
    middlewaredData: Map<string, any>;
    getMiddlewareData: (key: string) => any;
    setMiddlewareData: (key: string, value: any) => void;
}