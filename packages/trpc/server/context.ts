import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { createCookieFactory, clearCookieFactory, getCookieFactory } from "./utils/cookie";
export interface TRPCContext {
  createCookie: ReturnType<typeof createCookieFactory>;
  clearCookie: ReturnType<typeof clearCookieFactory>;
  getCookie: ReturnType<typeof getCookieFactory>;
}
export async function createContext({req, res}: CreateExpressContextOptions): Promise<TRPCContext> {
  const ctx = {
    createCookie: createCookieFactory(res),
    clearCookie: clearCookieFactory(res),
    getCookie: getCookieFactory(req),
  }
  return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
