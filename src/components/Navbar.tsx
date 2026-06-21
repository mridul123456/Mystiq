'use client'

import Link from 'next/link'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="px-4 py-3 shadow-md border-b border-zinc-800 bg-black text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Mystiq
        </Link>

        {session ? (
          <>
            <span className="hidden sm:block text-zinc-300">
               👋 Welcome {user?.username || user?.email}
            </span>

            <Button
              onClick={() => signOut()}
              className="bg-[#161B22] hover:bg-[#21262D]"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-[#161B22] hover:bg-[#21262D]">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar