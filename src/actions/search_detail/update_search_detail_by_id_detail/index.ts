"use server";
import type { Prisma, search_detail } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function updateSearchDetailById(
  id_detail: string,
  data: Prisma.search_detailUpdateInput
): Promise<search_detail> {
  // Remove undefined properties
  const updateData: Prisma.search_detailUpdateInput = {
    ...Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ),
    updated_at: new Date(),
  };

  return prisma.search_detail.update({
    where: { id_detail },
    data: updateData,
  });
}
