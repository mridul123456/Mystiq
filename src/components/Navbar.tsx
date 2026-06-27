// 'use client'

// import Link from 'next/link'
// import React from 'react'
// import { useSession, signOut } from 'next-auth/react'
// import { User } from 'next-auth'
// import { Button } from './ui/button'

// const Navbar = () => {
//   const { data: session } = useSession()
//   const user: User = session?.user as User

//   return (
//     <nav className="px-4 py-3 shadow-md border-b border-zinc-800 bg-black text-white">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         <Link href="/home" className="text-xl font-bold">
//           Mystiq
//         </Link>

//         {session ? (
//           <>
//             <span className="hidden sm:block text-zinc-300">
//                👋 Welcome {user?.username || user?.email}
//             </span>

//             <Button
//               onClick={() => signOut()}
//               className="
//                 bg-[#071224]
//                 border border-[#263041]
//                 text-white
//                 rounded-lg
//                 px-6
//                 py-2
//                 transition-all
//                 duration-300
//                 hover:bg-[#0B1A33]
//                 hover:border-[#4B5D7A]
//                 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]
//                 hover:scale-[1.02]
//               "
//             >
//               Logout
//             </Button>
//           </>
//         ) : (
//           <Link href="/sign-in">
//             <Button className="
//                 bg-[#071224]
//                 border border-[#263041]
//                 text-white
//                 rounded-lg
//                 px-6
//                 py-2
//                 transition-all
//                 duration-300
//                 hover:bg-[#0B1A33]
//                 hover:border-[#4B5D7A]
//                 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]
//                 hover:scale-[1.02]
//               "
//             >
//               Login
//             </Button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar

'use client'

import Link from 'next/link'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { X } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="px-4 py-3 shadow-md border-b border-zinc-800 bg-black text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/home" className="text-xl font-bold">
          Mystiq
        </Link>

        {session ? (
          <>
            <span className="hidden sm:block text-zinc-300">
              👋 Welcome {user?.username || user?.email}
            </span>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="
                    bg-[#071224]
                    border border-[#263041]
                    text-white
                    rounded-lg
                    px-6
                    py-2
                    transition-all
                    duration-300
                    hover:bg-[#0B1A33]
                    hover:border-[#4B5D7A]
                    hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]
                    hover:scale-[1.02]
                  "
                >
                Logout
              </Button>
                
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-[#161B22] border border-[#30363D] text-white">

                {/* <AlertDialogCancel
                  className="
                    absolute
                    right-4
                    top-4
                    h-8
                    w-8
                    p-0
                    border-none
                    bg-transparent
                    text-red-500 
                    hover:text-red-400
                  "
                >
                  <X className="h-4 w-4" />
                </AlertDialogCancel> */}

                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-zinc-400">
                    You will be logged out of your Mystiq account.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border border-[#30363D] text-white hover:bg-[#21262D]">
                    Cancel
                  </AlertDialogCancel>

    
                  <AlertDialogAction
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="
                bg-[#071224]
                border border-[#263041]
                text-white
                rounded-lg
                px-6
                py-2
                transition-all
                duration-300
                hover:bg-[#0B1A33]
                hover:border-[#4B5D7A]
                hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]
                hover:scale-[1.02]
              "
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar