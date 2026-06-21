'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { MessageSquareQuote } from 'lucide-react'
import messages from '../../../messages.json'

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center bg-[#0D1117] text-white px-4 py-8 md:px-24">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Dive into the World of Anonymous Feedback
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-400 px-2">
            Receive honest thoughts, anonymous opinions, and genuine feedback
            while keeping identities completely private.
          </p>
        </section>

        {/* Carousel */}
        <Carousel
          className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="overflow-hidden rounded-2xl border border-[#30363D] bg-[#161B22] text-white shadow-xl">

                    {/* Header */}
                    <CardHeader className="border-b border-[#30363D] bg-[#0D1117] py-3 px-4">
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-zinc-400">
                        <MessageSquareQuote className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-center">
                          {message.title}
                        </span>
                      </div>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="flex items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[220px] px-4 sm:px-6 md:px-8 py-6">
                      <p className="text-base sm:text-lg md:text-2xl font-semibold text-center leading-relaxed break-words">
                        "{message.content}"
                      </p>
                    </CardContent>

                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Hidden on mobile, swipe works naturally */}
          <CarouselPrevious className="hidden sm:flex border-[#30363D] bg-[#161B22] text-white hover:bg-[#21262D]" />

          <CarouselNext className="hidden sm:flex border-[#30363D] bg-[#161B22] text-white hover:bg-[#21262D]" />
        </Carousel>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363D] bg-zinc-950 py-4 text-center text-xs sm:text-sm text-zinc-500">
        © 2026 True Feedback. All rights reserved.
      </footer>
    </>
  )
}

export default Home