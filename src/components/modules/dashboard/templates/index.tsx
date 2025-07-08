import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "../components/DashboardHeader";
import DashboardMetricsCards from "../components/DashboardMetricsCards";
import TabRecentAnalysis from "../components/TabRecentAnalysis";
import { getRecentAnalyses, RecentAnalysis } from "@/actions/dashboard/recent_analysis";

const DashboardTemplate = async () => {
  const recentAnalyses: RecentAnalysis[] = await getRecentAnalyses();
  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader />
      <DashboardMetricsCards />
      <TabRecentAnalysis recentAnalyses={recentAnalyses} />
    </div>
  )
}

export default DashboardTemplate
