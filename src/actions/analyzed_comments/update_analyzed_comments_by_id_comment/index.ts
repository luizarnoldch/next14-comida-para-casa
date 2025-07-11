"use server";

import { PrismaClient, analyzed_comments } from "@/generated/prisma";

const prisma = new PrismaClient();

type UpdateAnalyzedCommentInput = Partial<
  Omit<analyzed_comments, "id_comment" | "created_at">
>;

export async function updateAnalyzedCommentByIdComment(
  id_comment: bigint,
  data: UpdateAnalyzedCommentInput
): Promise<analyzed_comments> {
  const updateData: any = {
    ...data,
    updated_at: new Date(),
  };

  if (data.metadata !== undefined) {
    updateData.metadata = data.metadata;
  } else {
    delete updateData.metadata;
  }

  return prisma.analyzed_comments.update({
    where: { id_comment },
    data: updateData,
  });
}
