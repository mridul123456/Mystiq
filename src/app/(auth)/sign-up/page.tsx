'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
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
import { Loader2, Eye, EyeOff } from 'lucide-react'

function Page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          )

          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>

          setUsernameMessage(
            axiosError.response?.data.message ??
              'Error checking username'
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        data
      )

      toast.success('Success', {
        description: response.data.message,
      })

      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error('Signup Failed', {
        description:
          axiosError.response?.data.message ||
          'Something went wrong',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] px-4">
      <div className="w-full max-w-xl p-10 md:p-12 space-y-8 bg-[#161B22] border border-[#30363D] rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
            Join Mystiq
          </h1>

          <p className="text-zinc-400 text-base">
            Create your account and start receiving anonymous feedback
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Username
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Choose a username"
                      className="h-12 bg-[#0D1117] border-[#30363D] text-white placeholder:text-zinc-500"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>

                  {isCheckingUsername && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking username...
                    </div>
                  )}

                  {username.trim() && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage ===
                        'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="h-12 bg-[#0D1117] border-[#30363D] text-white placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="Create a password"
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
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
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
              disabled={isSubmitting}
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-white hover:text-zinc-300 underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page