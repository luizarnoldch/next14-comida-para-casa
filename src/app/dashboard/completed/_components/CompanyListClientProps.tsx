"use client";

import { Suspense, use } from "react";
import CompanyCard from "./CompanyCard";
import { AnalisisSummary } from "@/actions/analytics/get_analytics";

interface CompanyListClientProps {
  companies: Promise<AnalisisSummary[]>;
}

export default function CompanyListClient({ companies }: CompanyListClientProps) {

  const client_companies = use(companies)

  if (client_companies.length === 0) {
    return <p className="text-center text-gray-500">No company data available.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense fallback={<div>Loading...</div>}>
        {client_companies.map(({ id_job, principal, competidores, counters, category }) => {
          // Mapear cada competidor string a un objeto con c_id_job + name
          const competitorsList = competidores.map((name) => ({
            c_id_job: id_job,
            name,
          }));

          // Construir el stats en el formato que espera CompanyCard
          const stats = {
            totalLinks: counters.totalVideos,
            facebook: counters.redSocial.facebook,
            instagram: counters.redSocial.instagram,
            tiktok: counters.redSocial.tiktok,
            other: counters.redSocial.other,
          };

          return (
            <CompanyCard
              key={id_job}
              empresa={principal}
              category={category}
              id_job={id_job}
              stats={stats}
              competitors={competitorsList}
            />
          );
        })}
      </Suspense>
    </div>
  );
}
