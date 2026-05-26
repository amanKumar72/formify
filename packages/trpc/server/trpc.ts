import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;
export const authenticatedProcedure = tRPCContext.procedure.use(async ({ctx, next})=>{
  const token = getAuthenticationCookie(ctx)
  const {id} = await userService.verifyToken(token)
  if(!id) {
    throw new Error("User is not logged in")
  }
  return next({
    ctx: {
      ...ctx,
      user: {id}
    }
  })
})
