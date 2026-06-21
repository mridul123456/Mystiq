'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      })

      if (response.data.success) {
        toast.success('Account Verified', {
          description: response.data.message,
        })

        router.replace('/sign-in')
        return
      }

      toast.error('Please enter the correct verification code.')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error('Verification Failed', {
        description:
          axiosError.response?.data.message ||
          'Something went wrong',
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] px-4">
      <div className="w-full max-w-xl p-10 md:p-12 space-y-8 bg-[#161B22] border border-[#30363D] rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
            Verify Your Account
          </h1>

          <p className="text-zinc-400 text-base">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Verification Code
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter verification code"
                      className="h-12 bg-[#0D1117] border-[#30363D] text-white placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="w-full h-12 bg-white text-black font-semibold hover:bg-zinc-200"
            >
              Verify Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount