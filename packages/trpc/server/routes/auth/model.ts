import z from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().min(1).describe("The full name of the user"),
  email: z.string().email().describe("The email address of the user"),
  password: z
    .string()
    .min(6)
    .describe("The password for the user, must be at least 6 characters long"),
});
export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("The unique identifier of the user"),
});
export const loginUserWithEmailAndPasswordInputModel = z.object({
  email: z.string().email().describe("The email address of the user"),
  password: z
    .string()
    .min(6)
    .describe("The password for the user, must be at least 6 characters long"),
});
export const loginUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("The unique identifier of the user"),
});

export const getLoggedInUserInfoIntput = z.undefined();
export const getLoggedInUserInfoOutput = z.object({
  fullName: z.string().describe("The full name of the user"),
  email: z.string().email().describe("The email address of the user"),
  profileImageUrl: z.string().nullable().describe("profile image url of user"),
  emailVerified: z.boolean().nullable().describe("is the user's email verified"),
  id: z.string().describe("The unique identifier of the user"),
});

export const signOutInputModel = z.object({});
export const signOutOutputModel = z.object({
  success: z.boolean().describe("Whether the user was signed out"),
});

export const updateProfileImageInputModel = z.object({
  dataUrl: z.string().min(1).describe("The profile image data URL"),
  filename: z.string().min(1).describe("The original filename"),
});
export const updateProfileImageOutputModel = z.object({
  url: z.string().url().describe("The uploaded profile image URL"),
  publicId: z.string().describe("The Cloudinary public id"),
});
