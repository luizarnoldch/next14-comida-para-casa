"use server";
import type { search_post_source } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getSearchPostSourceById(
  id: string
): Promise<search_post_source | null> {
  return prisma.search_post_source.findUnique({
    where: { id },
  });
}
