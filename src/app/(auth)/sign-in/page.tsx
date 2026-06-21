'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

function page() {
  const router = useRouter();
  
  //Zod implementation
  const form = useForm<z.infer<typeof signInSchema> >({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    },
    mode: 'onChange'
  })
  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
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
      //  window.location.href = '/dashboard';
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md" >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Mystiq
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
                      <FormLabel>Username/Email</FormLabel>
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

                <Button type="submit" className="w-full" disabled={!form.formState.isValid} >
                  LOG IN
                </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              New User?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                  Sign Up
              </Link>
            </p>
          </div>
      </div>
    </div>
  )
}

export default page