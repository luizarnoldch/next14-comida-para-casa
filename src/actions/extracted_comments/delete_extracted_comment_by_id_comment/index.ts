"use server";

import prisma from "@/lib/prisma";

export async function deleteExtractedCommentByIdComment(
  id_comment: bigint
): Promise<void> {
  await prisma.extracted_comments.delete({
    where: { id_comment },
  });
}
