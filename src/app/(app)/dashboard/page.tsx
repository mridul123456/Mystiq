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
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter(
        (message) => message._id.toString() !== messageId
      )
    )
  }

  const router = useRouter();
  const { data: session, status } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchmea),
  })

  const { watch, setValue } = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get<ApiResponse>(
        '/api/accept-messages'
      )

      setValue(
        'acceptMessages',
        response.data.isAcceptingMessage
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error('Error', {
        description:
          axiosError.response?.data.message ||
          'Failed to fetch message settings',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true)

      try {
        const response = await axios.get<ApiResponse>(
          '/api/get-messages'
        )

        setMessages(response.data.messages || [])

        // setValue(
        //   'acceptMessages',
        //   response.data.isAcceptingMessage
        // )

        if (refresh) {
          toast.success('Refreshed Messages', {
            description: 'Showing latest messages',
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>

        toast.error('Error', {
          description:
            axiosError.response?.data.message ||
            'Failed to fetch messages',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [setValue]
  )

  useEffect(() => {
    if (!session?.user) return

    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchMessages, fetchAcceptMessage])

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true)

      const newValue = !acceptMessages

      const response = await axios.post<ApiResponse>(
        '/api/accept-messages',
        {
          acceptMessages: newValue,
        }
      )

      setValue('acceptMessages', newValue)

      toast.success('Success', {
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error('Error', {
        description:
          axiosError.response?.data.message ||
          'Failed to update message settings',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const username = session?.user?.username

  useEffect(() => {
    setBaseUrl(
      `${window.location.protocol}//${window.location.host}`
    )
  }, [])

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)

    toast.success('URL Copied Successfully!')
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D1117] text-white">
        Loading...
      </div>
    )
  }

  if (status === 'unauthenticated') {
    // return (
    //   <div className="flex min-h-screen items-center justify-center bg-[#0D1117] text-white">
    //     Please Login
    //   </div>
    // )
    router.replace('/sign-in')
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white px-4 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Feedback Dashboard
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage your profile link and incoming anonymous
          messages.
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
            className="
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
            Copy Link
          </Button>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">
              Accept Anonymous Messages
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              {acceptMessages
                ? 'Visitors can currently send you anonymous messages.'
                : 'Anonymous messages are currently disabled.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
          <span
            className={`font-medium ${
              acceptMessages
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {acceptMessages
              ? 'Accepting Messages'
              : 'Messages Disabled'}
          </span>
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />

        </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Messages
        </h2>

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
                Share your link and start receiving
                anonymous feedback.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page