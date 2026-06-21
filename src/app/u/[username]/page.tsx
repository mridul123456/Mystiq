'use client'

import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'

interface PageProps {
  params: {
    username: string
  }
}

export default function PublicProfilePage({
  params,
}: PageProps) {
  const username = params.username

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)

  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Message is required')
      return
    }

    try {
      setIsSending(true)

      const response = await axios.post<ApiResponse>(
        '/api/send-message',
        {
          username,
          content: message,
          createdBy: name || 'Anonymous',
        }
      )

      toast.success('Success', {
        description: response.data.message,
      })

      setMessage('')
      setName('')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error('Failed', {
        description:
          axiosError.response?.data.message ||
          'Something went wrong',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSuggestMessages = async () => {
    try {
      setIsSuggesting(true)

      const response = await fetch(
        '/api/suggest-messages',
        {
          method: 'POST',
        }
      )

      const reader = response.body?.getReader()

      if (!reader) return

      const decoder = new TextDecoder()

      let result = ''

      while (true) {
        const { done, value } =
          await reader.read()

        if (done) break

        result += decoder.decode(value)
      }

      const questions = result
        .split('||')
        .map((q) => q.trim())
        .filter(Boolean)

      setSuggestions(questions)
    } catch (error) {
      toast.error('Failed to generate suggestions')
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white">
            Public Profile Link
          </h1>

          <p className="mt-4 text-zinc-400">
            Send anonymous feedback to @{username}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="bg-[#161B22] border-[#30363D] text-white"
          />

          <Textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Write your anonymous message here"
            className="min-h-[150px] bg-[#161B22] border-[#30363D] text-white"
          />

          <div className="flex justify-center">
            <Button
              onClick={handleSendMessage}
              disabled={isSending}
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
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send It'
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-10">

          <Button
            onClick={handleSuggestMessages}
            disabled={isSuggesting}
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
            {isSuggesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>

          <p className="mt-6 text-zinc-300">
            Click on any message below to select it.
          </p>

          <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              Messages
            </h2>

            <div className="space-y-3">
              {suggestions.map(
                (question, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setMessage(question)
                    }
                    className="w-full rounded-lg border border-[#30363D] p-4 text-left text-zinc-200 hover:bg-[#1F2937]"
                  >
                    {question}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}