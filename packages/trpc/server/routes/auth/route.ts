import { loginUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, getLoggedInUserInfoIntput, getLoggedInUserInfoOutput, loginUserWithEmailAndPasswordInputModel, loginUserWithEmailAndPasswordOutputModel } from "./model";
import { setAuthenticationCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure.meta({
    openapi: { method: "POST", path: getPath("/register"), tags: TAGS, summary: "Register a new user with email and password", protect: false }
  })
  .input(createUserWithEmailAndPasswordInputModel)
  .output(createUserWithEmailAndPasswordOutputModel)
  .mutation(async ({input}) => {
    const { fullName, email, password } = input;
    const {id} = await userService.createUserWithEmailAndPassword({ fullName, email, password });
    return {
      id
    }
  }),
  loginUserWithEmailAndPassword: publicProcedure.meta({
    openapi: { method: "POST", path: getPath("/login"), tags: TAGS, summary: "Login a user with email and password", protect: false }
  })
  .input(loginUserWithEmailAndPasswordInputModel)
  .output(loginUserWithEmailAndPasswordOutputModel)
  .mutation((async ({ctx, input}) => {
    const { email, password } = input;
    const { id, token } = await userService.loginUserWithEmailAndPassword({ email, password });
    setAuthenticationCookie(ctx, token)
    return {
      id
    }
  })),
  getLoggedInUserInfo: authenticatedProcedure.meta({
    openapi: { method: 'GET', path: getPath("/user"), tags: TAGS, summary: "Get the info of the logged in user", protect: true }
  }).input(getLoggedInUserInfoIntput).output(getLoggedInUserInfoOutput)
  .query(async ({ctx}) => {
    const {id} = ctx.user
    const user = await userService.getUserById(id)
    return user
  })
});
