import { Button } from "@/components/ui/button"
import { SparklesIcon } from "lucide-react"
import Link from "next/link"

type Props = {}

const DashboardHeaderCTA = (props: Props) => {


  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Button asChild className="flex gap-2" size="lg">
        <Link href="/dashboard/new-analysis">
          <SparklesIcon className="h-5 w-5" />
          Start New Analysis
        </Link>
      </Button>
    </div>
  )
}

export default DashboardHeaderCTA
