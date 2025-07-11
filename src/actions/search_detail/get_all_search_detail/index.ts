"use server";
import type { search_detail } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllSearchDetails(): Promise<search_detail[]> {
  return prisma.search_detail.findMany();
}
