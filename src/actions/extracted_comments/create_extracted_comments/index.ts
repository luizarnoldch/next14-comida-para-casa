"use server";
import type { Prisma, extracted_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createExtractedComment(
  data: Prisma.extracted_commentsCreateInput
): Promise<extracted_comments> {
  return prisma.extracted_comments.create({
    data,
  });
}
