"use server";
import type { Prisma, extracted_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

type UpdateExtractedCommentInput = Prisma.extracted_commentsUpdateInput;

export async function updateExtractedCommentByIdComment(
  id_comment: bigint,
  data: UpdateExtractedCommentInput
): Promise<extracted_comments> {
  const updateData: Prisma.extracted_commentsUpdateInput = {
    ...Object.fromEntries(
      Object.entries(data)
        .filter(([, v]) => v !== undefined)
        .map(([key, value]) => {
          if (value === null || typeof value !== "object") {
            return [key, { set: value }];
          }
          return [key, value];
        })
    ),
  };

  return prisma.extracted_comments.update({
    where: { id_comment },
    data: updateData,
  });
}
