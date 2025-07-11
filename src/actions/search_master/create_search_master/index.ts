"use server";
import type { Prisma, search_master } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createSearchMaster(
  data: Prisma.search_masterCreateInput
): Promise<search_master> {
  // Opcionalmente, si quieres manejar updated_at manualmente:
  // data.updated_at ??= new Date();

  return prisma.search_master.create({
    data,
  });
}
