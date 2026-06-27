'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

function Page() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    if (result?.error) {
      toast.error('Login Failed', {
        description: 'Incorrect username or password',
      })
    } else {
      toast.success('Login Successful')
    }

    if (result?.url) {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] px-4">
      <div className="w-full max-w-xl p-10 md:p-12 space-y-8 bg-[#161B22] border border-[#30363D] rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
            Mystiq
          </h1>

          <p className="text-zinc-400 text-base">
            Sign in to start your anonymous journey
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Username / Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your username or email"
                      className="h-12 bg-[#0D1117] border-[#30363D] text-white placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 bg-[#0D1117] border-[#30363D] text-white placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="
                          h-12
                          bg-[#0D1117]
                          border-[#30363D]
                          text-white
                          placeholder:text-zinc-500
                          pr-12
                        "
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-zinc-500
                          hover:text-white
                          transition-colors
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="
                w-full
                h-12
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
              Sign In
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-zinc-400">
            New to Mystiq?{' '}
            <Link
              href="/sign-up"
              className="text-white hover:text-zinc-300 underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page