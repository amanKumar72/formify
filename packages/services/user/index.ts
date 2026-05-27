import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { createHmac, randomBytes } from "crypto";
import JWT from "jsonwebtoken";
import {
  createUserWithEmailAndPasswordInput,
  CreateUserWithEmailAndPasswordInputType,
  generateUserTokenPayloadInput,
  GenerateUserTokenPayloadInputType,
  loginUserWithEmailAndPasswordInput,
  LoginUserWithEmailAndPasswordInputType,
} from "./model";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email)).execute();
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }

  private async hashPassword(password: string, salt: string) {
    const hash = createHmac("sha256", salt).update(password).digest("hex");
    return { hash };
  }

  private async generateToken(payload: GenerateUserTokenPayloadInputType) {
    // Implement token generation logic here (e.g., JWT)
    const { id } = await generateUserTokenPayloadInput.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  public async verifyToken(token: string) {
    // Implement token generation logic here (e.g., JWT)
    const payload = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadInputType;
    return { id: payload.id };
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);
    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new Error(`A user with the email ${email} already exists.`);
    }

    const salt = randomBytes(16).toString("hex");
    const { hash } = await this.hashPassword(password, salt);
    const createdUser = await db
      .insert(usersTable)
      .values({
        fullName,
        email,
        password: hash,
        salt,
      })
      .returning({ id: usersTable.id })
      .execute();

    if (!createdUser || createdUser.length === 0 || !createdUser[0]?.id) {
      throw new Error("Failed to create user.");
    }

    return { id: createdUser[0].id };
  }

  public async loginUserWithEmailAndPassword(payload: LoginUserWithEmailAndPasswordInputType) {
    const { email, password } = await loginUserWithEmailAndPasswordInput.parseAsync(payload);
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const { hash } = await this.hashPassword(password, user.salt);

    if (hash !== user.password) {
      throw new Error("Invalid email or password.");
    }

    const { token } = await this.generateToken({ id: user.id });

    return { id: user.id, token };
  }

  public async getUserById(id: string) {
    const result = await db.select({
      fullName: usersTable.fullName,
      email: usersTable.email,
      profileImageUrl: usersTable.profileImageUrl,
      id: usersTable.id,
      emailVerified: usersTable.emailVerified,
     })
     .from(usersTable)
     .where(eq(usersTable.id, id))
     .execute();
    if (!result || result.length === 0) {
      throw new Error(`User not exists with ${id} id`);
    }
    return result[0]!;
  }

  public async updateProfileImage(userId: string, profileImageUrl: string) {
    const [user] = await db
      .update(usersTable)
      .set({ profileImageUrl })
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .execute();

    if (!user) {
      throw new Error(`User not exists with ${userId} id`);
    }

    return user;
  }
}

export default UserService;
