'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User'
import { acceptMessageSchmea } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const page = () => {

    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [baseUrl, setBaseUrl] = useState('')
    
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id.toString() !== messageId))
    }

    const { data: session, status } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchmea)
    })
    const {register, watch, setValue} = form
    const acceptMessages = watch('acceptMessages')
    
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Error', {
                description: `${axiosError.response?.data.message} || Failed to fetch message settings`
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback( async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response?.data?.messages || [])
            setValue('acceptMessages', response.data.isAcceptingMessage)
            if(refresh) {
                toast.success('Refreshed Messages', {
                    description: `Showing latest messages`
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Error', {
                description: `${axiosError.response?.data.message} || Failed to fetch message settings`
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if(!session || !session.user) {
            return; 
        }
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    //handle switch change
    const handleSwitchChange = async() => {
        try {
            const newValue = !acceptMessages;
            const response = await axios.post<ApiResponse>('api/accept-messages', {
                acceptMessages: newValue
            })   
            setValue('acceptMessages', newValue)
            toast.success('', {
                description: response.data?.message
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Error', {
                description: `${axiosError.response?.data.message} || Failed to fetch message settings`
            })
        }
    }

    const username = session?.user?.username
    
    useEffect(() => {
        setBaseUrl(`${window.location.protocol}//${window.location.host}`)
    }, [])

    const profileUrl = `${baseUrl}/u/${username}`
    // const profileUrl = username ? `${process.env.NEXT_PUBLIC_APP_URL}/u/${username}` : ''

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success('Url Copied Successfully!')
    }

    // if(!session || !session.user) {
    //     return <div>Please Login</div>
    // }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        return <div>Please Login</div>
    }

    return (
  <div className="min-h-screen bg-[#0D1117] text-white px-4 md:px-8 lg:px-12 py-8">
    
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold">
        Feedback Dashboard
      </h1>

      <p className="text-zinc-400 mt-2">
        Manage your profile link and incoming anonymous messages.
      </p>
    </div>

    {/* Profile Link Card */}
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Your Unique Link
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="flex-1 h-12 rounded-lg bg-[#0D1117] border border-[#30363D] px-4 text-zinc-300"
        />

        <Button
          onClick={copyToClipboard}
          className="h-12 bg-white text-black hover:bg-zinc-200"
        >
          Copy Link
        </Button>
      </div>
    </div>

    {/* Settings Card */}
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">
            Accept Anonymous Messages
          </h2>

          <p className="text-sm text-zinc-400">
            Allow visitors to send you anonymous messages.
          </p>
        </div>

        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">
        Messages
      </h2>

      <Button
        variant="outline"
        className="border-[#30363D] bg-[#161B22] hover:bg-[#21262D] text-white"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </>
        )}
      </Button>
    </div>

    <Separator className="mb-6 bg-[#30363D]" />

    {/* Messages Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={message?._id?.toString() || index}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <div className="col-span-full">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 text-center">
            <h3 className="text-lg font-semibold mb-2">
              No Messages Yet
            </h3>

            <p className="text-zinc-400">
              Share your link and start receiving anonymous feedback.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)
}

export default page