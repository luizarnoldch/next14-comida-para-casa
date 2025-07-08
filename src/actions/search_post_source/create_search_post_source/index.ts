"use server";
import type { Prisma, search_post_source } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createSearchPostSource(
  data: Prisma.search_post_sourceCreateInput
): Promise<search_post_source> {
  // Manejar manual updated_at si lo deseas:
  // data.updated_at ??= new Date();

  return prisma.search_post_source.create({
    data,
  });
}
