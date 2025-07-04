import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  change: string
  description: string
  negative?: boolean
}

function MetricCard({ title, value, change, description, negative = false }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={negative ? "text-red-500" : "text-green-500"}>{change}</span> {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default MetricCard