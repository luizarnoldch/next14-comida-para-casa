"use server";
import prisma from "@/lib/prisma";

export async function deleteSearchPostSourceById(id: string): Promise<void> {
  await prisma.search_post_source.delete({
    where: { id },
  });
}
