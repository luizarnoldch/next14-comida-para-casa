import { getAllSearchs } from "@/actions/search_master/get_all_search"

type Props = {}

const HomePage = async (props: Props) => {

  const data = await getAllSearchs()

  return (
    <div>
      HomePage
      <div>
        {JSON.stringify(data)}
      </div>
    </div>
  )
}

export default HomePage
