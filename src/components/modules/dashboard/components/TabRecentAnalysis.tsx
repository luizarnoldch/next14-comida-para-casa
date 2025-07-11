import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { getRecentAnalyses, RecentAnalysis } from "@/actions/search_master/dashboard/dashboard_recent_analysis";

type Props = {
}

const TabRecentAnalysis = async ({ }: Props) => {
  const recentAnalyses: RecentAnalysis[] = await getRecentAnalyses();

  return (
    <Tabs defaultValue="recent">
      <TabsList>
        <TabsTrigger value="recent">Recent Analyses</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your most recent emotional analysis projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between border-b last:border-0 pb-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{analysis.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{analysis.platform}</span>
                    <span>•</span>
                    <span>{analysis.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={analysis.status} />
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/dashboard/${analysis.status.toLowerCase().replace(/ /g, '-')}/${analysis.id}`}
                    >
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default TabRecentAnalysis

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor()}`}>{status}</span>
}
