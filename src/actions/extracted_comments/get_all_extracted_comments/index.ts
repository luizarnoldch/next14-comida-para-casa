"use server";
import type { extracted_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllExtractedComments(): Promise<extracted_comments[]> {
  return prisma.extracted_comments.findMany();
}
