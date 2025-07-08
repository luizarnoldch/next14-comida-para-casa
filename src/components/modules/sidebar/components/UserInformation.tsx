import { headers } from 'next/headers'

// import { auth } from '@/lib/auth'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserInformationProps = {}

const UserInformation = async (props: UserInformationProps) => {
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // })

  // Temporal Data
  const session = {
    user: {
      image: "",
      name: "Admin",
      email: "admin@example.com"
    }
  }

  const fullName = session?.user.name ?? ''

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <>
      <Avatar className='size-8 rounded-lg'>
        <AvatarImage className='' src={session?.user.image ?? ""} alt={session?.user.name} />
        <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
      </Avatar>
      <div className='grid flex-1 w-4/5 text-sm leading-tight text-left'>
        <span className='truncate font-medium'>{session?.user.name}</span>
        <span className='truncate text-xs opacity-80'>{session?.user.email}</span>
      </div>
    </>
  )
}

export default UserInformation
