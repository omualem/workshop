import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request & { requestId?: string }, response: Response, next: NextFunction) {
    const requestId = request.header("x-request-id") ?? randomUUID();
    request.requestId = requestId;
    response.setHeader("x-request-id", requestId);
    next();
  }
}
