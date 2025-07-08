import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, Sparkles, CheckCircle } from "lucide-react"
import { DashboardMetrics, getDashboardMetrics } from "@/actions/dashboard/dasboard_metrics"
import { getAllSearchMasters } from "@/actions/search_master/get_all_search_master"

const DashboardMetricsCards = async () => {
  const metrics: DashboardMetrics = await getDashboardMetrics()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Analyses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalAnalyses}</div>
          <p className="text-xs text-muted-foreground">Total analyses performed</p>
        </CardContent>
      </Card>

      {/* Pending Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pending}</div>
          <p className="text-xs text-muted-foreground">Awaiting processing</p>
        </CardContent>
      </Card>

      {/* In Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.inProgress}</div>
          <p className="text-xs text-muted-foreground">Currently analyzing</p>
        </CardContent>
      </Card>

      {/* Completed Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.completed}</div>
          <p className="text-xs text-muted-foreground">Ready for review</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardMetricsCards
