import { TabsContent } from "@/components/ui/tabs"

import { getCommentsByCompanyAndDate } from "../../../../../actions/analytics/get_analytics"


import { Suspense } from "react"
import NPSHorizontalBarDash from "./company_dash/NPSHorizontalBarDash"
import NPSRoundedDash from "./company_dash/NPSRoundedDash"
import { ComentarioMetadata } from "@/types/network"

type Props = {}

const SentimentTab = async (props: Props) => {

  // const scraperPoliticData: PoliticalComment[] = await getScrapperDataByCandidateAndDateFromTo("Javier Gonzales", "2023-01-01", "2026-01-01")

  const results = getCommentsByCompanyAndDate("Mercadona", "2023-01-01", "2026-01-01");

  // results es tipo Array<JsonValue>, forzamos el tipo a ComentarioMetadata[]
  const scraperCompanyData = results as Promise<ComentarioMetadata[]>

  return (
    <TabsContent value="sentiment" className="space-y-4">

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<div>loading...</div>}>
          <NPSHorizontalBarDash data={scraperCompanyData} />
        </Suspense>
        <Suspense fallback={<div>loading...</div>}>
          <NPSRoundedDash data={scraperCompanyData} />
        </Suspense>
        {/* <ComparacionPolitica scraperData={scraperCompanyData} />

        <CredibilidadPercepcion scraperData={scraperCompanyData} /> */}
      </div>

      {/* <EmotionsInYear scraperData={scraperCompanyData} /> */}

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Analyses" value="124" change="+12%" description="vs. previous period" />
            <MetricCard title="Positive Sentiment" value="68%" change="+5%" description="vs. previous period" />
            <MetricCard
              title="Engagement Rate"
              value="4.2%"
              change="-0.8%"
              description="vs. previous period"
              negative
            />
            <MetricCard title="Avg. Confidence" value="87%" change="+2%" description="vs. previous period" />
          </div> */}

      <div className="grid gap-4 md:grid-cols-2">
        {/* <ComparacionPolitica scraperData={scraperCompanyData} />

        <CredibilidadPercepcion scraperData={scraperCompanyData} /> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* <IntencionDeVoto scraperData={scraperCompanyData} />

        <DecisionDeVoto scraperData={scraperCompanyData} /> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* <TemasPopulares data={scraperCompanyData} /> */}

        {/* <EmocionGeneral scraperData={scraperCompanyData} /> */}


      </div>

      {/* <Card>
            <CardHeader>
              <CardTitle>Platform Comparison</CardTitle>
              <CardDescription>Sentiment analysis across different social media platforms</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex h-full items-center justify-center">
                <EmbeddedChart type="bar" />
              </div>
            </CardContent>
          </Card> */}
    </TabsContent>
  )
}

export default SentimentTab
