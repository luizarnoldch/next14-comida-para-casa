"use server";
import type { search_detail } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getSearchDetailById(id_detail: string): Promise<search_detail | null> {
  return prisma.search_detail.findUnique({
    where: { id_detail },
  });
}
