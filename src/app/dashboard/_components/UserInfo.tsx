"use client"

import { useEffect, useState } from "react"

type Props = {}

const UserInfo = (props: Props) => {
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    // Get user info from localStorage in client component
    const userInfo = localStorage.getItem("user")
    if (userInfo) {
      const { name } = JSON.parse(userInfo)
      setUserName(name)
    }
  }, [])
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}</h1>
      <p className="text-muted-foreground">Here's an overview of your emotional analysis platform</p>
    </div>
  )
}

export default UserInfo