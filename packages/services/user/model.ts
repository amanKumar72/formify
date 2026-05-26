import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().min(1).describe("The full name of the user"),
  email: z.email().describe("The email address of the user"),
  password: z.string().min(6).describe("The password for the user, must be at least 6 characters long"),
})

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;

export const loginUserWithEmailAndPasswordInput = z.object({
  email: z.email().describe("The email address of the user"),
  password: z.string().min(6).describe("The password for the user, must be at least 6 characters long"),
})

export type LoginUserWithEmailAndPasswordInputType = z.infer<typeof loginUserWithEmailAndPasswordInput>;

export const generateUserTokenPayloadInput = z.object({
  id: z.string().describe("Id of the user")
})

export type GenerateUserTokenPayloadInputType = z.infer<typeof generateUserTokenPayloadInput>