"use server";

import prisma from "@/lib/prisma";

export interface DashboardMetrics {
  totalAnalyses: number;
  pending: number;
  inProgress: number;
  completed: number;
  previousMonthTotal?: number;
  growthPercentage?: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const analysis = await prisma.search_master.findMany({
    select: {
      job_status: true,
    },
  });

  let pending = 0;
  let inProgress = 0;
  let completed = 0;

  analysis.forEach((item) => {
    switch (item.job_status) {
      case "created":
        completed += 1;
        break;
      case "pending":
        pending += 1;
        break;
      case "in_progress":
        inProgress += 1;
        break;
    }
  });

  const totalAnalyses = pending + inProgress + completed;

  return {
    totalAnalyses,
    pending,
    inProgress,
    completed,
  };
}
