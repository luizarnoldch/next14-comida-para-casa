// pages or app dir, archivo como server component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { getCommentsByCompanyAndDate } from "@/actions/analytics/get_analytics"
import NPSRoundedDash from './company_dash/NPSRoundedDash';
import { Suspense } from 'react';
import NPSHorizontalBarDash from './company_dash/NPSHorizontalBarDash';
import EmotionHorizontalBarDash from './company_dash/EmotionHorizontalBarDash';
import { ComentarioMetadata } from '@/types/network';

type Props = {}

const ComparisonTab = async (props: Props) => {
  const resultsMercadona = getCommentsByCompanyAndDate("Mercadona", "2023-01-01", "2026-01-01")

  const resultsCarrefour = getCommentsByCompanyAndDate("Carrefour", "2023-01-01", "2026-01-01")


  // results es tipo Array<JsonValue>, forzamos el tipo a ComentarioMetadata[]
  const scraperMercadonaCompanyData = resultsMercadona as Promise<ComentarioMetadata[]>
  const scraperCarrefourCompanyData = resultsCarrefour as Promise<ComentarioMetadata[]>

  return (
    <TabsContent value="company" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Mercadona</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 w-full">
              {/* Aquí pasamos data y el nombre del campo con el que queremos agrupar y mostrar */}
              <Suspense fallback={<div>loading...</div>}>
                <NPSHorizontalBarDash data={scraperMercadonaCompanyData} />
              </Suspense>
              <Suspense fallback={<div>loading...</div>}>
                <NPSRoundedDash data={scraperMercadonaCompanyData} />
              </Suspense>
              <Suspense fallback={<div>loading...</div>}>
                <EmotionHorizontalBarDash data={scraperMercadonaCompanyData} />
              </Suspense>

            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Carrefour</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 w-full">
              {/* Aquí pasamos data y el nombre del campo con el que queremos agrupar y mostrar */}
              <Suspense fallback={<div>loading...</div>}>
                <NPSHorizontalBarDash data={scraperCarrefourCompanyData} />
              </Suspense>
              <Suspense fallback={<div>loading...</div>}>
                <NPSRoundedDash data={scraperCarrefourCompanyData} />
              </Suspense>
              <Suspense fallback={<div>loading...</div>}>
                <EmotionHorizontalBarDash data={scraperCarrefourCompanyData} />
              </Suspense>

            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  )
}
export default ComparisonTab