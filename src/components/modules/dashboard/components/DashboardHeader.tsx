import DashboardHeaderCTA from './DashboardHeaderCTA'
import DashboardHeaderTitle from './DashboardHeaderTitle'

type Props = {}

const DashboardHeader = (props: Props) => {
  return (
    <div className="flex justify-between items-center">
      <DashboardHeaderTitle />
      <DashboardHeaderCTA />
    </div>
  )
}

export default DashboardHeader
