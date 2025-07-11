"use server";
import type { extraction_jobs } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllExtractionJobs(): Promise<extraction_jobs[]> {
  return prisma.extraction_jobs.findMany();
}
