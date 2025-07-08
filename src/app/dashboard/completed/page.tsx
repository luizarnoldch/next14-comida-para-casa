import { AnalisisSummary, getAllCompany } from "../../../actions/analytics/get_analytics";
import CompanyListClient from "./_components/CompanyListClientProps";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'

export default async function CompletedAnalysesPage() {
  // const companiesDetails: AnalisisSummary[] = await getAllEmpresasWithSummary();

  const companiesDetails: Promise<AnalisisSummary[]> = getAllCompany();

  return (
    <main className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Completed Analyses</h1>
        <p className="text-muted-foreground">
          Review and export your completed emotional analyses
        </p>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyListClient companies={companiesDetails} />
      </Suspense>
    </main>
  );
}
