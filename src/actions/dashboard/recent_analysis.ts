"use server";

import { format } from "date-fns";
import prisma from "@/lib/prisma";

export interface RecentAnalysis {
  id: string;
  title: string;
  platform: string;
  date: string;
  status: string;
}

export async function getRecentAnalyses(): Promise<RecentAnalysis[]> {
  const analyses = await prisma.search_master.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    select: {
      id_job: true,
      name_job: true,
      job_status: true,
      created_at: true,
      category: true,
    },
  });

  return analyses.map((analysis) => ({
    id: analysis.id_job,
    title: analysis.name_job || "Untitled Analysis",
    platform: analysis.category || "General",
    date: format(analysis.created_at, "MMM dd, yyyy"),
    status: formatStatus(analysis.job_status || ""),
  }));
}

function formatStatus(status: string | undefined): string {
  if (!status) return "Completed";

  switch (status.toLowerCase()) {
    case "created":
      return "Completed";
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    default:
      return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
