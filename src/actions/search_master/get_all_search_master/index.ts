"use server";
import type { search_master } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllSearchMasters(): Promise<search_master[]> {
  console.log("getAllSearchMasters")
  return prisma.search_master.findMany();
}
