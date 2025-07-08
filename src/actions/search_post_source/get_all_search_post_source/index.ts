"use server";
import type { search_post_source } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllSearchPostSources(): Promise<search_post_source[]> {
  return prisma.search_post_source.findMany();
}
