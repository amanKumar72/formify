import { loginUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { cloudinaryUploadService, userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoIntput,
  getLoggedInUserInfoOutput,
  loginUserWithEmailAndPasswordInputModel,
  loginUserWithEmailAndPasswordOutputModel,
  signOutInputModel,
  signOutOutputModel,
  updateProfileImageInputModel,
  updateProfileImageOutputModel,
} from "./model";
import { clearAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/register"),
        tags: TAGS,
        summary: "Register a new user with email and password",
        protect: false,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { fullName, email, password } = input;
      const { id } = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });
      return {
        id,
      };
    }),
  loginUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/login"),
        tags: TAGS,
        summary: "Login a user with email and password",
        protect: false,
      },
    })
    .input(loginUserWithEmailAndPasswordInputModel)
    .output(loginUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const { id, token } = await userService.loginUserWithEmailAndPassword({ email, password });
      setAuthenticationCookie(ctx, token);
      return {
        id,
      };
    }),
  getLoggedInUserInfo: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/user"),
        tags: TAGS,
        summary: "Get the info of the logged in user",
        protect: true,
      },
    })
    .input(getLoggedInUserInfoIntput)
    .output(getLoggedInUserInfoOutput)
    .query(async ({ ctx }) => {
      const { id } = ctx.user;
      const user = await userService.getUserById(id);
      return user;
    }),
  signOut: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/logout"),
        tags: TAGS,
        summary: "Sign out the current user",
        protect: true,
      },
    })
    .input(signOutInputModel)
    .output(signOutOutputModel)
    .mutation(({ ctx }) => {
      clearAuthenticationCookie(ctx);
      return {
        success: true,
      };
    }),
  updateProfileImage: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/profile-image"),
        tags: TAGS,
        summary: "Update the logged in user's profile image",
        protect: true,
      },
    })
    .input(updateProfileImageInputModel)
    .output(updateProfileImageOutputModel)
    .mutation(async ({ ctx, input }) => {
      const uploadedFile = await cloudinaryUploadService.uploadFile({
        dataUrl: input.dataUrl,
        filename: input.filename,
        folder: `users/${ctx.user.id}/profile`,
      });

      await userService.updateProfileImage(ctx.user.id, uploadedFile.url);

      return {
        url: uploadedFile.url,
        publicId: uploadedFile.publicId,
      };
    }),
});
