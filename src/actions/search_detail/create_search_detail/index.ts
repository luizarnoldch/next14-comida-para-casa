"use server";
import type { Prisma, search_detail } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createSearchDetail(
  data: Prisma.search_detailCreateInput
): Promise<search_detail> {
  return prisma.search_detail.create({ data });
}
