'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Loader2Icon } from "lucide-react";
import { signInSchmea } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

function page() {
  const router = useRouter();
  
  //Zod implementation
  const form = useForm<z.infer<typeof signInSchmea> >({
    resolver: zodResolver(signInSchmea),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })
  
  const onSubmit = async (data: z.infer<typeof signInSchmea>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if(result?.error) {
      toast.error('Login Failed', {
        description: 'Incorrect Username and Password'
      })
    } else {
      toast.success('Login Successful')
    }

    if(result?.url) {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md" >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4" >
              Sign in to start your anonymous adventure
            </p>
          </div>

          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >
               <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Username/Email"
                          className="border border-gray-300"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" >
                  SignIn
                </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              New User?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                  Sign up
              </Link>
            </p>
          </div>
      </div>
    </div>
  )
}

export default page