import type React from "react"
import { SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sparkles } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen flex-col w-full">
          <div className="flex items-center justify-between pt-4 pl-4">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </SidebarProvider>
    </>
  )
}
