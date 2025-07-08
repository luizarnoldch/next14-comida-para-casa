import { CircleUserIcon, EllipsisVerticalIcon, Settings2Icon } from 'lucide-react'

import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'

import LogoutButton from './LogoutButton'
import UserInformation from './UserInformation'
import ThemeToggle from './ThemeToggle'
import UserInforamtionDropDownContent from './UserInforamtionDropDownContent'

type Props = {}

const UserInformationDropDown = async (props: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <UserInformation />
          <EllipsisVerticalIcon className="" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <UserInforamtionDropDownContent>
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <UserInformation />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CircleUserIcon /><span>Account</span>
          </DropdownMenuItem>
          <ThemeToggle />
          <DropdownMenuItem>
            <Settings2Icon /><span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </UserInforamtionDropDownContent>
    </DropdownMenu>
  )
}

export default UserInformationDropDown