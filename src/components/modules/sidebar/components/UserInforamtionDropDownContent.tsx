"use client"

import { DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { useSidebar } from '@/components/ui/sidebar'

type UserInforamtionDropDownContentProps = {
  children?: React.ReactNode
}

const UserInforamtionDropDownContent = ({ children }: UserInforamtionDropDownContentProps) => {

  const { isMobile } = useSidebar()
  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      {children}
    </DropdownMenuContent>
  )
}

export default UserInforamtionDropDownContent