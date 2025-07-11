"use client"

// Temporary Content Start
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { BarChart3, Home, LayoutDashboard, LogOut, Settings, Sparkles, Clock } from "lucide-react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
// Temporary Content End

import {
  Sidebar,
} from "@/components/ui/sidebar"
import SidebarDashboardHeader from "../components/SidebarDashboardHeader"
import SidebarDashboardFooter from "../components/SidebarDashboardFooter"
import SidebarDashboardContent from "../components/SidebarDashboardContent"
import UserInformation from "../components/UserInformation"

type SidebarDashboardProps = {
}

const SidebarDashboard = ({ }: SidebarDashboardProps) => {

  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Skip rendering sidebar on login page
  if (pathname === "/login") {
    return null
  }
  return (
    <Sidebar>
      {/* <SidebarDashboardHeader />
      <SidebarDashboardContent />
      <SidebarDashboardFooter /> */}

      {/* Temporary Content */}
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 py-4">
          <Sparkles className="h-6 w-6" />
          <span className="font-semibold">Emotion Analysis</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/new-analysis"}>
              <Link href="/dashboard/new-analysis">
                <Sparkles className="h-5 w-5" />
                <span>New Analysis</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/in-progress"}>
              <Link href="/dashboard/in-progress">
                <Clock className="h-5 w-5" />
                <span>In-Progress Analyses</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/completed"}>
              <Link href="/dashboard/completed">
                <LayoutDashboard className="h-5 w-5" />
                <span>Completed Analyses</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/analytics"}>
              <Link href="/dashboard/analytics">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 flex">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">User</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SidebarDashboard
