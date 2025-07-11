import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { ChevronDown } from 'lucide-react'
import React from 'react'

type Props = {}

const SidebarDashboardHeader = (props: Props) => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                Select Workspace
                <ChevronDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[12rem] right-0">
              <DropdownMenuItem>
                <span>Acme Inc</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Acme Corp.</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <h3 className='text-center text-2xl font-semibold'>Atomic Ecommerce</h3>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

export default SidebarDashboardHeader