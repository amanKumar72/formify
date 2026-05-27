import { CookieOptions, Response, Request } from "express";
import { TRPCContext } from "../context";
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_YAER = 365 * ONE_DAY;
const sameSite: CookieOptions["sameSite"] =
  process.env.NODE_ENV === "production" ? "none" : "strict";
const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite,
  maxAge: ONE_YAER,
  path: "/",
};

export function createCookieFactory(res: Response) {
  return function createCookie(
    name: string,
    value: string,
    options: CookieOptions = defaultCookieOptions,
  ) {
    res.cookie(name, value, options);
  };
}

export function clearCookieFactory(res: Response) {
  return function clearCookie(name: string, options: CookieOptions = defaultCookieOptions) {
    res.clearCookie(name, options);
  };
}

export function getCookieFactory(req: Request) {
  return function getCookie(name: string) {
    return req.cookies?.[name];
  };
}

const AUTH_COOKIE_NAME = "authentication-token";
export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string) {
  ctx.createCookie(AUTH_COOKIE_NAME, accessToken);
}

export function clearAuthenticationCookie(ctx: TRPCContext) {
  ctx.clearCookie(AUTH_COOKIE_NAME, defaultCookieOptions);
}

export function getAuthenticationCookie(ctx: TRPCContext) {
  return ctx.getCookie(AUTH_COOKIE_NAME);
}
