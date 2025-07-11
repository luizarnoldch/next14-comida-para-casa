"use server";
import type { Prisma, extraction_jobs } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createExtractionJob(
  data: Prisma.extraction_jobsCreateInput
): Promise<extraction_jobs> {
  return prisma.extraction_jobs.create({
    data,
  });
}
