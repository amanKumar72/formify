import { trpc } from "~/trpc/client"

export const useSignUp = () => {
  const utils = trpc.useUtils()
  const {
    mutate: createUserWithEmailAndPassword,
    mutateAsync: createUserWithEmailAndPasswordAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    reset,
    status
  } = trpc.auth.createUserWithEmailAndPassword.useMutation(
    {
      onSuccess: async () => {
        await utils.auth.getLoggedInUserInfo.invalidate()
      }
    }
  )
  return {
    createUserWithEmailAndPassword,
    createUserWithEmailAndPasswordAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    reset,
    status
  }
}

export const useSignIn = () => {
  const utils = trpc.useUtils()
  const {
    mutate: loginUserWithEmailAndPassword,
    mutateAsync: loginUserWithEmailAndPasswordAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    reset,
    status
  } = trpc.auth.loginUserWithEmailAndPassword.useMutation(
    {
      onSuccess: async () => {
        await utils.auth.getLoggedInUserInfo.invalidate()
      }
    }
  )
  return {
    loginUserWithEmailAndPassword,
    loginUserWithEmailAndPasswordAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    reset,
    status
  }
}

// export const useSignOut = () => {
//   const {
//     mutate: signOut,
//     mutateAsync: signOutAsync,
//     error,
//     failureCount,
//     isError,
//     isIdle,
//     isSuccess,
//     reset,
//     status
//   } = trpc.auth.signOut.useMutation()
//   return {
//     signOut,
//     signOutAsync,
//     error,
//     failureCount,
//     isError,
//     isIdle,
//     isSuccess,
//     reset,
//     status
//   }
// }

export const useUser = () => {
  const {
    data,
    error,
    failureCount,
    isError,
    isLoading,
    isSuccess,
    status
  } = trpc.auth.getLoggedInUserInfo.useQuery()
  return {
    user: data,
    error,
    failureCount,
    isError,
    isLoading,
    isSuccess,
    status
  }
}