"use server";

import type { analyzed_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

type CreateAnalyzedCommentInput = Omit<analyzed_comments, "id"> & {
  created_at?: Date;
  updated_at?: Date;
};

export async function createAnalyzedComment(data: CreateAnalyzedCommentInput) {
  return prisma.analyzed_comments.create({
    data: {
      ...data,
      metadata: data.metadata === null ? undefined : data.metadata,
      created_at: data.created_at ?? new Date(),
      updated_at: data.updated_at ?? new Date(),
    },
  });
}
