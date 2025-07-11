"use server";
import type { Prisma, search_post_source } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function updateSearchPostSourceById(
  id: string,
  data: Prisma.search_post_sourceUpdateInput
): Promise<search_post_source> {
  const updateData: Prisma.search_post_sourceUpdateInput = {
    ...Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ),
    updated_at: new Date(),
  };

  return prisma.search_post_source.update({
    where: { id },
    data: updateData,
  });
}
