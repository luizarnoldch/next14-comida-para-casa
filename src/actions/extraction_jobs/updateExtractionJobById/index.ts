"use server";
import type { Prisma, extraction_jobs } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function updateExtractionJobById(
  id: string,
  data: Prisma.extraction_jobsUpdateInput
): Promise<extraction_jobs> {
  // Clean undefined fields, set updated_at manually
  const updateData: Prisma.extraction_jobsUpdateInput = {
    ...Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ),
    updated_at: new Date(),
  };

  return prisma.extraction_jobs.update({
    where: { id },
    data: updateData,
  });
}
