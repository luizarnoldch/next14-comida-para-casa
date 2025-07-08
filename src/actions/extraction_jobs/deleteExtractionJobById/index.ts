"use server";
import prisma from "@/lib/prisma";

export async function deleteExtractionJobById(id: string): Promise<void> {
  await prisma.extraction_jobs.delete({
    where: { id },
  });
}
