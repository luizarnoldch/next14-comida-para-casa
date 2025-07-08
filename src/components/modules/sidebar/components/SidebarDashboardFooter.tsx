import { SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import UserInformationDropDown from './UserInformationDropDown'

type Props = {}

const SidebarDashboardFooter = (props: Props) => {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserInformationDropDown />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

export default SidebarDashboardFooter