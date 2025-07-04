import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import DashboardMetricsCards from "./_components/DashboardMetricsCards"
import UserInfo from "./_components/UserInfo"
import TabRecentAnalysis from "./_components/TabRecentAnalysis"
import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <UserInfo />

      <div className="flex flex-col gap-4 md:flex-row">
        <Button asChild className="flex gap-2" size="lg">
          <Link href="/dashboard/new-analysis">
            <Sparkles className="h-5 w-5" />
            Start New Analysis
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <DashboardMetricsCards />
      </Suspense>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Analyses</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <TabRecentAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  )
}



// Sample data
const recentAnalyses = [
  {
    id: "1",
    title: "Brand Sentiment Analysis - Acme Inc",
    platform: "Facebook, Instagram",
    date: "Today",
    status: "In Progress",
  },
  {
    id: "2",
    title: "Product Launch Campaign",
    platform: "TikTok",
    date: "Yesterday",
    status: "Completed",
  },
  {
    id: "3",
    title: "Competitor Analysis - XYZ Corp",
    platform: "All Platforms",
    date: "3 days ago",
    status: "Completed",
  },
  {
    id: "4",
    title: "Customer Feedback Analysis",
    platform: "Instagram",
    date: "1 week ago",
    status: "Completed",
  },
]
