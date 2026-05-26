'use client'
import { useUser } from "~/hooks/api/auth";
import { api } from "~/trpc/server";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const {user, isLoading} = useUser()
  const router = useRouter()
  if (isLoading) {
    return <div>Loading...</div>
  }
  if(!user) {
    router.push("/signin")
    return null
  }
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Formify - Stream in Style</h1>
        <Link href="/dashboard">Dashboard</Link>
        <h2>Server Status: {status}</h2>
      </div>
    </main>
  );
}
