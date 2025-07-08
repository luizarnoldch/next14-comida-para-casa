"use server";
import type { search_master } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getSearchMasterById(
  id_job: string
): Promise<search_master | null> {
  return prisma.search_master.findUnique({
    where: { id_job },
  });
}
