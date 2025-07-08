"use server";
import type { extraction_jobs } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getExtractionJobById(
  id: string
): Promise<extraction_jobs | null> {
  return prisma.extraction_jobs.findUnique({
    where: { id },
  });
}
