"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Pause, Play, Eye } from "lucide-react"
import Link from "next/link"

export default function InProgressPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Work Progress</h1>
        <p className="text-muted-foreground">Track and manage your ongoing analyses</p>
      </div>

      <Tabs defaultValue="in-progress">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} status="pending" />
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} status="in-progress" />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} status="completed" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Analysis {
  id: string
  title: string
  date: string
  platform: string
  videos: number
  progress?: number
}

interface AnalysisCardProps {
  analysis: Analysis
  status: "pending" | "in-progress" | "completed"
}

function AnalysisCard({ analysis, status }: AnalysisCardProps) {
  const [isPaused, setIsPaused] = useState(false)

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            {isPaused ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isPaused ? "Paused" : "In Progress"}
          </Badge>
        )
      case "completed":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{analysis.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Created on {analysis.date} • {analysis.platform} • {analysis.videos} videos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "in-progress" && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Analysis progress</span>
              <span>{analysis.progress}%</span>
            </div>
            <Progress value={analysis.progress} className="h-2" />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {status === "pending" && (
            <>
              <Button size="sm" variant="default">
                Start Analysis
              </Button>
              <Button size="sm" variant="outline">
                Edit Configuration
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                Delete
              </Button>
            </>
          )}

          {status === "in-progress" && (
            <>
              <Button size="sm" variant={isPaused ? "default" : "outline"} onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? <Play className="mr-1 h-4 w-4" /> : <Pause className="mr-1 h-4 w-4" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="mr-1 h-4 w-4" />
                Preview Results
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                Cancel
              </Button>
            </>
          )}

          {status === "completed" && (
            <>
              <Button size="sm" variant="default" asChild>
                <Link href={`/dashboard/completed/${analysis.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View Results
                </Link>
              </Button>
              <Button size="sm" variant="outline">
                Export Report
              </Button>
              <Button size="sm" variant="outline">
                Clone Analysis
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Sample data
const pendingAnalyses: Analysis[] = [
  {
    id: "p1",
    title: "New Product Feedback Analysis",
    date: "May 21, 2025",
    platform: "Facebook, Instagram",
    videos: 8,
  },
  {
    id: "p2",
    title: "Competitor Brand Sentiment",
    date: "May 20, 2025",
    platform: "TikTok",
    videos: 12,
  },
]

const inProgressAnalyses: Analysis[] = [
  {
    id: "ip1",
    title: "Brand Sentiment Analysis - Acme Inc",
    date: "May 22, 2025",
    platform: "Facebook, Instagram, TikTok",
    videos: 15,
    progress: 45,
  },
  {
    id: "ip2",
    title: "Marketing Campaign Effectiveness",
    date: "May 19, 2025",
    platform: "Instagram",
    videos: 7,
    progress: 78,
  },
  {
    id: "ip3",
    title: "User Testimonial Sentiment",
    date: "May 18, 2025",
    platform: "Facebook",
    videos: 5,
    progress: 92,
  },
]

const completedAnalyses: Analysis[] = [
  {
    id: "c1",
    title: "Product Launch Campaign",
    date: "May 15, 2025",
    platform: "TikTok",
    videos: 10,
  },
  {
    id: "c2",
    title: "Competitor Analysis - XYZ Corp",
    date: "May 10, 2025",
    platform: "All Platforms",
    videos: 24,
  },
]
