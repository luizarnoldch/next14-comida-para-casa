"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function deleteAnalyzedCommentByIdComment(
  id_comment: bigint
): Promise<void> {
  await prisma.analyzed_comments.delete({
    where: { id_comment },
  });
}
