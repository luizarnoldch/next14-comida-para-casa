"use server";
import type { Prisma, search_master } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function updateSearchMasterById(
  id_job: string,
  data: Prisma.search_masterUpdateInput
): Promise<search_master> {
  const updateData: Prisma.search_masterUpdateInput = {
    ...Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ),
    updated_at: new Date(),
  };

  return prisma.search_master.update({
    where: { id_job },
    data: updateData,
  });
}
