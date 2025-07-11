import DashboardHeader from "../components/DashboardHeader";
import DashboardMetricsCards from "../components/DashboardMetricsCards";
import TabRecentAnalysis from "../components/TabRecentAnalysis";

// export const dynamic = 'force-dynamic'
//                        ss * mm * hh
// export const revalidate = 10 * 1 * 1

const DashboardTemplate = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader />

      {/* <Suspense fallback={<div>Loading...</div>}>
        <DashboardMetricsCards />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <TabRecentAnalysis />
      </Suspense> */}

      <DashboardMetricsCards />
      <TabRecentAnalysis />
    </div>
  )
}

export default DashboardTemplate
