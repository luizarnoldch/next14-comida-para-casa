import { headers } from 'next/headers'

type Props = {}

const DashboardHeaderTitle = (props: Props) => {
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

  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}</h1>
      <p className="text-muted-foreground">Here's an overview of your emotional analysis platform</p>
    </div>
  )
}

export default DashboardHeaderTitle
