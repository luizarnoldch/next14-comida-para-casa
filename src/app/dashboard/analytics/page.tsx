import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import DatePicker from "./_components/DatePicker"
// import MetricCard from "./_components/MetricCard"
import EmbeddedChart from "./_components/EmbeddedChart"
import SentimentTab from "./_components/Tabs/SentimentTab"
import ComparisonTab from "./_components/Tabs/ComparisonTab"

export default async function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Visualize and explore your emotional analysis data</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="mb-4">
          <TabsTrigger value="sentiment">Setiment Overview</TabsTrigger>
          <TabsTrigger value="company">Company Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <SentimentTab />
        <ComparisonTab />

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Facebook</CardTitle>
                <CardDescription>Sentiment analysis for Facebook content</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex h-full items-center justify-center">
                  <EmbeddedChart type="facebook" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instagram</CardTitle>
                <CardDescription>Sentiment analysis for Instagram content</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex h-full items-center justify-center">
                  <EmbeddedChart type="instagram" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TikTok</CardTitle>
                <CardDescription>Sentiment analysis for TikTok content</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex h-full items-center justify-center">
                  <EmbeddedChart type="tiktok" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Analysis</CardTitle>
              <CardDescription>Sentiment breakdown by topic and keyword</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <div className="flex h-full items-center justify-center">
                <EmbeddedChart type="topics" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}