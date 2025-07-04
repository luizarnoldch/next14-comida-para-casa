import { redirect } from "next/navigation"

type Props = {}

const HomePage = async (props: Props) => {
  redirect("/login")
}

export default HomePage
