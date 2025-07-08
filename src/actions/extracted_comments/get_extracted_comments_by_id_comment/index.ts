"use server";
import type { extracted_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getExtractedCommentByIdComment(
  id_comment: bigint
): Promise<extracted_comments | null> {
  return prisma.extracted_comments.findUnique({
    where: { id_comment },
  });
}
