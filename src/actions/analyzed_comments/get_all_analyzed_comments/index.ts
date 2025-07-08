"use server";

import { analyzed_comments } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllAnalyzedComments(): Promise<analyzed_comments[]> {
  return await prisma.analyzed_comments.findMany();
}
