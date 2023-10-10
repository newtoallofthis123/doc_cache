import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from "react";
import Nav from "@/components/base/nav";
import useAuth from "@/hooks/use-auth";
import useTheme from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DocCache | Hospital Management System, Done Right',
  description: 'DocCache is a fast and accessible hospital management system for the modern age.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await useAuth()
  const theme = useTheme()

  return (
    <html lang="en">
      <body className={`dark:text-white dark:bg-neutral-900 ${inter.className}`}>
        <Nav auth={auth}/>
          {children}
        <Toaster/>
      </body>
    </html>
  )
}
