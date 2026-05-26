"use client";

import {
  IconArrowNarrowRight,
  IconBrandGithub,
  IconBrandGoogle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSignIn } from "~/hooks/api/auth";

type SignInFormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const { loginUserWithEmailAndPasswordAsync, reset } = useSignIn();

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await loginUserWithEmailAndPasswordAsync({
        email: data.email,
        password: data.password,
      });
      reset();
      router.push("/");
      toast.success("Sign in success", {
        position: "top-right",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      toast.error(message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center font-body overflow-hidden antialiased">
      <div className="w-full min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:flex flex-col justify-between w-1/2 p-8 lg:p-12 bg-surface-container-lowest relative border-r border-white/5">
          <div className="relative z-10 p-4 md:p-8">
            <h1 className="heading-bold">FormFlow</h1>
          </div>
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 bg-primary/5 rounded-xl border border-white/10 backdrop-blur-xl transform rotate-6 scale-95 shadow-2xl transition-transform duration-1000 hover:rotate-0 hover:scale-100 flex flex-col p-6 gap-4">
                <div className="w-1/2 h-6 bg-surface-container rounded border border-white/5"></div>
                <div className="w-full h-12 bg-surface-container rounded border border-white/5"></div>
                <div className="w-full h-12 bg-surface-container rounded border border-white/5"></div>
                <div className="mt-auto w-full h-10 bg-primary rounded shadow-[0_0_15px_rgba(183,245,105,0.2)]"></div>
              </div>
              <div className="absolute inset-4 bg-surface/30 rounded-xl border border-white/10 backdrop-blur-2xl transform -rotate-3 shadow-2xl p-6 flex flex-col gap-6">
                <div className="w-2/3 h-6 bg-white/10 rounded"></div>
                <div className="space-y-2">
                  <div className="w-1/4 h-4 bg-white/5 rounded"></div>
                  <div className="w-full h-10 bg-surface rounded border border-white/10 flex items-center px-3">
                    <div className="w-4 h-4 rounded-full bg-primary/50"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-1/3 h-4 bg-white/5 rounded"></div>
                  <div className="w-full h-10 bg-surface rounded border border-white/10"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 max-w-md space-y-4 mb-10 ml-10">
            <p className="heading-bold">Welcome back to your workspace.</p>
            <p className="paragraph">
              Continue building precise forms, clean workflows, and reliable data pipelines.
            </p>
          </div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-[0.05] pointer-events-none"></div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-surface relative z-10">
          <div className="w-full max-w-md space-y-8">
            <div className="md:hidden flex justify-center mb-8">
              <h1 className="heading-bold">FormFlow</h1>
            </div>
            <div>
              <h2 className="heading-bold mb-2">Sign In</h2>
              <p className="paragraph">Authenticate to continue.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-2 transition-all duration-300">
                <label className="input-label" htmlFor="email">
                  WORK EMAIL
                </label>
                <div className="relative">
                  <IconMail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@company.com"
                    className="input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </div>
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-2 transition-all duration-300">
                <label className="input-label" htmlFor="password">
                  PASSWORD
                </label>
                <div className="relative">
                  <IconLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="input"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                  >
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>
              <button className="btn-primary" type="submit">
                Enter Workspace
                <IconArrowNarrowRight />
              </button>
            </form>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="font-mono text-base text-on-surface-variant">
                OR AUTHENTICATE VIA
              </span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="social-signin-btn" type="button">
                <IconBrandGoogle />
                Google
              </button>
              <button className="social-signin-btn" type="button">
                <IconBrandGithub />
                GitHub
              </button>
            </div>
            <div className="text-center space-y-4 pt-4">
              <p className="font-body text-base text-on-surface-variant">
                Need an account?{" "}
                <Link
                  className="text-primary hover:text-primary underline decoration-white/30 hover:decoration-primary underline-offset-4 transition-all"
                  href="/signup"
                >
                  Create one
                </Link>
              </p>
              <p className="font-body text-base text-on-surface-variant/60">
                Access is protected by your workspace credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
