'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
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
import { X, MessageSquare, Calendar } from 'lucide-react'
import { Message } from '@/model/User'
import { toast } from 'sonner'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProp = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({
  message,
  onMessageDelete,
}: MessageCardProp) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      )
      toast.success('Message Deleted', {
        description: response.data.message,
      })

      onMessageDelete(message._id.toString())
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }

  return (
    <Card className="bg-[#161B22] border border-[#30363D] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
      
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300">
            {message.createdBy || "Anonymous User"}
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-md text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-[#161B22] border border-[#30363D] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Message?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-zinc-400">
                This action cannot be undone. The message will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border border-[#30363D] text-white hover:bg-[#21262D]">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6">
        <p className="text-zinc-100 leading-relaxed break-words">
          {message.content}
        </p>

        {message.createdAt && (
          <div className="flex items-center gap-2 mt-6 text-xs text-zinc-500">
            <Calendar className="h-3 w-3" />
            {new Date(message.createdAt).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MessageCard