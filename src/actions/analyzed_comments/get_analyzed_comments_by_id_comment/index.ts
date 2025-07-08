"use server";

import { analyzed_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAnalyzedCommentByIdComment(
  id_comment: bigint
): Promise<analyzed_comments | null> {
  return await prisma.analyzed_comments.findUnique({
    where: { id_comment },
  });
}
