import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import SidebarDashboard from "@/components/modules/sidebar/templates/SidebarDashboard"
import SidebarDashboardInset from "@/components/modules/sidebar/components/SidebarDashboardInset"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SidebarDashboard />
      <SidebarDashboardInset>
        {children}
      </SidebarDashboardInset>
    </SidebarProvider>
  )
}
